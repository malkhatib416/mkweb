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
 * Uses the first slug to look up category in DB and set categoryId.
 * Missing languages/categories are created automatically from the MDX data.
 */

import { eq } from "drizzle-orm";
import fs from "fs";
import matter from "gray-matter";
import path from "path";
import { db } from "../db";
import { blog, category, language, translation } from "../db/schema";
import { CATEGORIES_TO_SEED, LANGUAGES_TO_SEED } from "./consts";

const CONTENT_DIR = path.join(process.cwd(), "content/blog");
const LOCALES = ["fr", "en"] as const;
type Locale = typeof LOCALES[number];

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

function formatCategoryName(slug: string): string {
  const seededCategory = CATEGORIES_TO_SEED.find((item) => item.slug === slug);
  if (seededCategory) {
    return seededCategory.name;
  }

  return slug
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCategoryDescription(slug: string, locale: Locale): string {
  const seededCategory = CATEGORIES_TO_SEED.find((item) => item.slug === slug);
  if (seededCategory) {
    return seededCategory.description;
  }

  if (locale === "fr") {
    return `Categorie ${formatCategoryName(slug)}`;
  }

  return `${formatCategoryName(slug)} category`;
}

function loadMdxPosts(): MdxPost[] {
  const posts: MdxPost[] = [];

  for (const locale of LOCALES) {
    const dir = path.join(CONTENT_DIR, locale);
    if (!fs.existsSync(dir)) continue;

    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const file of files) {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(dir, file);
      const raw = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(raw);

      const title = data?.title;
      if (!title || typeof title !== "string") {
        console.warn(
          `⚠️  Skipping ${locale}/${file}: missing or invalid title`
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
        content: content?.trim() ?? "",
        categorySlug: categorySlug || null,
      });
    }
  }

  return posts;
}

/** Load all categories from DB and return a map slug -> id */
async function loadCategorySlugToId(): Promise<Map<string, string>> {
  const rows = await db
    .select({
      id: category.id,
      slug: translation.slug,
      locale: translation.locale,
    })
    .from(translation)
    .innerJoin(category, eq(translation.categoryId, category.id))
    .where(eq(translation.entityType, "category"));
  const map = new Map<string, string>();
  for (const row of rows) {
    map.set(`${row.locale}:${row.slug}`, row.id);
  }
  return map;
}

async function ensureLanguages(dryRun: boolean) {
  for (const lang of LANGUAGES_TO_SEED) {
    const existing = await db
      .select({ code: language.code })
      .from(language)
      .where(eq(language.code, lang.code))
      .limit(1);

    if (existing.length > 0) {
      continue;
    }

    if (dryRun) {
      console.log(`  Would create language: ${lang.code}`);
      continue;
    }

    await db.insert(language).values(lang);
    console.log(`  Created language: ${lang.code}`);
  }
}

async function ensureCategoriesForPosts(posts: MdxPost[], dryRun: boolean) {
  const categorySlugToId = await loadCategorySlugToId();
  const requiredSlugs = Array.from(
    new Set(posts.map((post) => post.categorySlug).filter(Boolean))
  ) as string[];

  for (const slug of requiredSlugs) {
    const hasAnyLocale = LOCALES.some((locale) =>
      categorySlugToId.has(`${locale}:${slug}`)
    );

    if (hasAnyLocale) {
      continue;
    }

    if (dryRun) {
      console.log(`  Would create category: ${slug}`);
      for (const locale of LOCALES) {
        categorySlugToId.set(`${locale}:${slug}`, `dry-run:${slug}`);
      }
      continue;
    }

    const [createdCategory] = await db.insert(category).values({}).returning();

    await db.insert(translation).values(
      LOCALES.map((locale) => ({
        entityType: "category" as const,
        categoryId: createdCategory.id,
        locale,
        slug,
        name: formatCategoryName(slug),
        description: formatCategoryDescription(slug, locale),
      }))
    );

    for (const locale of LOCALES) {
      categorySlugToId.set(`${locale}:${slug}`, createdCategory.id);
    }

    console.log(`  Created category: ${slug}`);
  }

  return categorySlugToId;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const overwrite = args.includes("--overwrite");

  if (dryRun) {
    console.log("🔍 Dry run — no changes will be written.\n");
  }

  const posts = loadMdxPosts();
  if (posts.length === 0) {
    console.log("No MDX posts found in content/blog/{fr,en}/");
    process.exit(0);
  }

  await ensureLanguages(dryRun);
  const categorySlugToId = await ensureCategoriesForPosts(posts, dryRun);

  console.log(`Found ${posts.length} MDX post(s) to migrate.\n`);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  for (const post of posts) {
    const categoryId = post.categorySlug
      ? categorySlugToId.get(`${post.locale}:${post.categorySlug}`) ??
        categorySlugToId.get(`fr:${post.categorySlug}`) ??
        null
      : null;
    if (post.categorySlug && !categoryId) {
      console.warn(
        `  ⚠️  Category slug "${post.categorySlug}" not found in DB for [${post.locale}] ${post.slug}`
      );
    }

    const existing = await db.query.translation.findFirst({
      where: (t, { eq: e, and: a }) =>
        a(
          e(t.entityType, "blog"),
          e(t.slug, post.slug),
          e(t.locale, post.locale)
        ),
    });

    if (existing?.blogId) {
      if (overwrite && !dryRun) {
        await db
          .update(blog)
          .set({
            image: post.image,
            categoryId,
            updatedAt: new Date(),
          })
          .where(eq(blog.id, existing.blogId));
        await db
          .update(translation)
          .set({
            title: post.title,
            description: post.description,
            content: post.content,
            updatedAt: new Date(),
          })
          .where(eq(translation.id, existing.id));
        updated++;
        console.log(
          `  Updated: [${post.locale}] ${post.slug}${
            categoryId ? ` (category: ${post.categorySlug})` : ""
          }`
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
      const [createdBlog] = await db
        .insert(blog)
        .values({
          image: post.image,
          status: "published",
          categoryId,
        })
        .returning();
      await db.insert(translation).values({
        entityType: "blog",
        blogId: createdBlog.id,
        locale: post.locale,
        slug: post.slug,
        title: post.title,
        description: post.description,
        content: post.content,
      });
      inserted++;
      console.log(
        `  Inserted: [${post.locale}] ${post.slug}${
          categoryId ? ` (category: ${post.categorySlug})` : ""
        }`
      );
    } else {
      console.log(
        `  Would insert: [${post.locale}] ${post.slug}${
          categoryId ? ` (category: ${post.categorySlug})` : ""
        }`
      );
      inserted++;
    }
  }

  console.log("");
  if (dryRun) {
    console.log(
      `Dry run: would insert ${inserted}, ${
        overwrite ? `update ${updated}, ` : ""
      }skip ${skipped}`
    );
  } else {
    console.log(
      `Done: ${inserted} inserted, ${updated} updated, ${skipped} skipped.`
    );
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
