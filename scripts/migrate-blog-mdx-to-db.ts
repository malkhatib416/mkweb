/**
 * Migrate MDX blog articles from content/blog/{locale}/*.mdx into the blog table.
 *
 * Usage:
 *   bun run --env-file=.env scripts/migrate-blog-mdx-to-db.ts
 *   bun run --env-file=.env scripts/migrate-blog-mdx-to-db.ts --dry-run
 *   bun run --env-file=.env scripts/migrate-blog-mdx-to-db.ts --overwrite
 *
 * - Default: inserts only posts that don't exist (slug+locale). Skips existing.
 * - --overwrite: updates title, description, image, content, categoryId for existing slug+locale.
 * - --dry-run: prints what would be done without writing to the DB.
 *
 * Category: reads frontmatter categories (array of slugs, e.g. ['seo', 'tech']).
 * Uses the first slug to look up category in DB and set categoryId. Run db:seed first for categories.
 */

import { eq } from 'drizzle-orm';
import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';
import { db } from '../db';
import { blog, category } from '../db/schema';

const CONTENT_DIR = path.join(process.cwd(), 'content/blog');
const LOCALES = ['fr', 'en'] as const;
type Locale = (typeof LOCALES)[number];

function isLocale(dir: string): dir is Locale {
  return LOCALES.includes(dir as Locale);
}

interface MdxPost {
  slug: string;
  locale: Locale;
  title: string;
  description: string | null;
  image: string | null;
  content: string;
  /** First category slug from frontmatter categories array */
  categorySlug: string | null;
}

function loadMdxPosts(): MdxPost[] {
  const posts: MdxPost[] = [];

  for (const locale of LOCALES) {
    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'));
    for (const file of files) {
      const slug = file.replace(/\.mdx$/, '');
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(raw);

      const title = data?.title;
      if (!title || typeof title !== 'string') {
        console.warn(
          `⚠️  Skipping ${locale}/${file}: missing or invalid title`,
        );
        continue;
      }

      const categoriesRaw = data?.categories;
      const categorySlug =
        Array.isArray(categoriesRaw) && categoriesRaw.length > 0
          ? String(categoriesRaw[0]).trim()
          : null;

      posts.push({
        slug,
        locale,
        title: String(title),
        description:
          data?.description != null ? String(data.description) : null,
        image: data?.image != null ? String(data.image) : null,
        content: content?.trim() ?? '',
        categorySlug: categorySlug || null,
      });
    }
  }

  return posts;
}

/** Load all categories from DB and return a map slug -> id */
async function loadCategorySlugToId(): Promise<Map<string, string>> {
  const rows = await db
    .select({ id: category.id, slug: category.slug })
    .from(category);
  const map = new Map<string, string>();
  for (const row of rows) {
    map.set(row.slug, row.id);
  }
  return map;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const overwrite = args.includes('--overwrite');

  if (dryRun) {
    console.log('🔍 Dry run — no changes will be written.\n');
  }

  const categorySlugToId = await loadCategorySlugToId();
  if (categorySlugToId.size === 0) {
    console.warn(
      '⚠️  No categories in DB. Run bun run db:seed to create categories. categoryId will be null.\n',
    );
  }

  const posts = loadMdxPosts();
  if (posts.length === 0) {
    console.log('No MDX posts found in content/blog/{fr,en}/');
    process.exit(0);
  }

  console.log(`Found ${posts.length} MDX post(s) to migrate.\n`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const categoryId = post.categorySlug
      ? (categorySlugToId.get(post.categorySlug) ?? null)
      : null;
    if (post.categorySlug && !categoryId) {
      console.warn(
        `  ⚠️  Category slug "${post.categorySlug}" not found in DB for [${post.locale}] ${post.slug}`,
      );
    }

    const existing = await db.query.blog.findFirst({
      where: (b, { eq: e, and: a }) =>
        a(e(b.slug, post.slug), e(b.locale, post.locale)),
    });

    if (existing) {
      if (overwrite && !dryRun) {
        await db
          .update(blog)
          .set({
            title: post.title,
            description: post.description,
            image: post.image,
            content: post.content,
            categoryId,
            updatedAt: new Date(),
          })
          .where(eq(blog.id, existing.id));
        updated++;
        console.log(
          `  Updated: [${post.locale}] ${post.slug}${categoryId ? ` (category: ${post.categorySlug})` : ''}`,
        );
      } else {
        skipped++;
        if (!dryRun) {
          console.log(`  Skipped (exists): [${post.locale}] ${post.slug}`);
        } else {
          console.log(`  Would skip (exists): [${post.locale}] ${post.slug}`);
        }
      }
      continue;
    }

    if (!dryRun) {
      await db.insert(blog).values({
        title: post.title,
        slug: post.slug,
        locale: post.locale,
        description: post.description,
        image: post.image,
        content: post.content,
        status: 'published',
        categoryId,
      });
      inserted++;
      console.log(
        `  Inserted: [${post.locale}] ${post.slug}${categoryId ? ` (category: ${post.categorySlug})` : ''}`,
      );
    } else {
      console.log(
        `  Would insert: [${post.locale}] ${post.slug}${categoryId ? ` (category: ${post.categorySlug})` : ''}`,
      );
      inserted++;
    }
  }

  console.log('');
  if (dryRun) {
    console.log(
      `Dry run: would insert ${inserted}, ${overwrite ? `update ${updated}, ` : ''}skip ${skipped}`,
    );
  } else {
    console.log(
      `Done: ${inserted} inserted, ${updated} updated, ${skipped} skipped.`,
    );
  }
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
