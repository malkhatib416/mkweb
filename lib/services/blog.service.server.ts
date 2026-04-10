/**
 * Blog service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/db';
import { blog, category, translation } from '@/db/schema';
import { defaultLocale } from '@/locales/i18n';
import {
  contentValidator,
  localeEnum,
  readingTimeValidator,
  slugValidator,
  statusEnum,
  titleValidator,
} from '@/lib/validations/entities';
import type {
  Blog,
  BlogListParams,
  BlogListResponse,
  BlogResponse,
  BlogTranslation,
  Category,
  CategoryTranslation,
  CreateBlogDto,
  Locale,
  UpdateBlogDto,
} from '@/types/entities';
import { and, count, desc, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

export const blogSchema = z.object({
  title: titleValidator,
  slug: slugValidator,
  locale: localeEnum,
  description: z.string().optional().nullable(),
  image: z.string().url().optional().or(z.literal('')),
  content: contentValidator,
  status: statusEnum,
  categoryId: z.string().optional().nullable(),
  readingTime: readingTimeValidator,
});

export const blogUpdateSchema = z.object({
  title: titleValidator.optional(),
  slug: slugValidator.optional(),
  locale: localeEnum.optional(),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().or(z.literal('')),
  content: contentValidator.optional(),
  status: statusEnum.optional(),
  categoryId: z.string().optional().nullable(),
  readingTime: readingTimeValidator,
});

function pickBlogTranslation(
  translations: BlogTranslation[],
  locale?: Locale,
): BlogTranslation | null {
  if (locale) {
    const exact = translations.find((item) => item.locale === locale);
    if (exact) return exact;
  }

  return (
    translations.find((item) => item.locale === defaultLocale) ??
    translations[0] ??
    null
  );
}

function pickCategoryTranslation(
  translations: CategoryTranslation[],
  locale?: Locale,
): CategoryTranslation | null {
  if (locale) {
    const exact = translations.find((item) => item.locale === locale);
    if (exact) return exact;
  }

  return (
    translations.find((item) => item.locale === defaultLocale) ??
    translations[0] ??
    null
  );
}

class BlogServiceServer {
  private async getBlogTranslations(
    blogIds: string[],
  ): Promise<BlogTranslation[]> {
    if (blogIds.length === 0) return [];

    const rows = await db
      .select()
      .from(translation)
      .where(
        and(
          eq(translation.entityType, 'blog'),
          inArray(translation.blogId, blogIds),
        ),
      );

    return rows as BlogTranslation[];
  }

  private async getCategoryData(categoryIds: string[]) {
    if (categoryIds.length === 0) {
      return new Map<
        string,
        {
          parent: typeof category.$inferSelect;
          translations: CategoryTranslation[];
        }
      >();
    }

    const [parents, translations] = await Promise.all([
      db.select().from(category).where(inArray(category.id, categoryIds)),
      db
        .select()
        .from(translation)
        .where(
          and(
            eq(translation.entityType, 'category'),
            inArray(translation.categoryId, categoryIds),
          ),
        ),
    ]);

    const result = new Map<
      string,
      {
        parent: typeof category.$inferSelect;
        translations: CategoryTranslation[];
      }
    >();

    for (const parent of parents) {
      result.set(parent.id, { parent, translations: [] });
    }

    for (const item of translations as CategoryTranslation[]) {
      if (!item.categoryId) continue;
      const entry = result.get(item.categoryId);
      if (entry) entry.translations.push(item);
    }

    return result;
  }

  private mapCategory(
    parent: typeof category.$inferSelect,
    translations: CategoryTranslation[],
    locale?: Locale,
  ): Category {
    const current = pickCategoryTranslation(translations, locale);
    if (!current?.name) {
      throw new Error('Category translation not found');
    }

    return {
      ...parent,
      locale: current.locale,
      name: current.name,
      slug: current.slug,
      description: current.description ?? null,
      translations,
    };
  }

  private mapBlog(
    parent: typeof blog.$inferSelect,
    translations: BlogTranslation[],
    locale?: Locale,
    categoryMap?: Map<
      string,
      {
        parent: typeof category.$inferSelect;
        translations: CategoryTranslation[];
      }
    >,
  ): Blog {
    const current = pickBlogTranslation(translations, locale);
    if (!current?.title || !current.content) {
      throw new Error('Blog translation not found');
    }

    const categoryEntry = parent.categoryId
      ? categoryMap?.get(parent.categoryId)
      : undefined;

    return {
      ...parent,
      locale: current.locale,
      title: current.title,
      slug: current.slug,
      description: current.description ?? null,
      content: current.content,
      translations,
      category: categoryEntry
        ? this.mapCategory(
            categoryEntry.parent,
            categoryEntry.translations,
            locale,
          )
        : null,
    };
  }

  private async assertSlugAvailable(
    slug: string,
    locale: Locale,
    excludeTranslationId?: string,
  ) {
    const existing = await db.query.translation.findFirst({
      where: (t, { eq: e, and: a, ne: n }) =>
        excludeTranslationId
          ? a(
              e(t.entityType, 'blog'),
              e(t.slug, slug),
              e(t.locale, locale),
              n(t.id, excludeTranslationId),
            )
          : a(e(t.entityType, 'blog'), e(t.slug, slug), e(t.locale, locale)),
    });

    if (existing) {
      throw new Error('Slug already exists for this locale');
    }
  }

  async getAll(params: BlogListParams = {}): Promise<BlogListResponse> {
    const {
      page = 1,
      limit = 10,
      status,
      locale = defaultLocale,
      categoryId,
    } = params;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(translation.entityType, 'blog'),
      eq(translation.locale, locale),
    ];

    if (status === 'published' || status === 'draft') {
      conditions.push(eq(blog.status, status));
    }
    if (categoryId) {
      conditions.push(eq(blog.categoryId, categoryId));
    }

    const whereClause = and(...conditions);

    const rows = await db
      .select({ parent: blog, current: translation })
      .from(translation)
      .innerJoin(blog, eq(translation.blogId, blog.id))
      .where(whereClause)
      .orderBy(desc(blog.createdAt))
      .limit(limit)
      .offset(offset);

    const totalResult = await db
      .select({ count: count() })
      .from(translation)
      .innerJoin(blog, eq(translation.blogId, blog.id))
      .where(whereClause);

    const blogIds = rows.map((row) => row.parent.id);
    const translations = await this.getBlogTranslations(blogIds);
    const translationMap = new Map<string, BlogTranslation[]>();

    for (const item of translations) {
      if (!item.blogId) continue;
      const list = translationMap.get(item.blogId) ?? [];
      list.push(item);
      translationMap.set(item.blogId, list);
    }

    const categoryIds = rows
      .map((row) => row.parent.categoryId)
      .filter((value): value is string => Boolean(value));
    const categoryMap = await this.getCategoryData(categoryIds);

    const blogs = rows.map((row) =>
      this.mapBlog(
        row.parent,
        translationMap.get(row.parent.id) ?? [row.current as BlogTranslation],
        locale,
        categoryMap,
      ),
    );

    const total = totalResult[0]?.count || 0;
    return {
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getById(id: string, locale?: Locale): Promise<BlogResponse> {
    const parent = await db.query.blog.findFirst({
      where: (b, { eq: e }) => e(b.id, id),
    });

    if (!parent) {
      throw new Error('Blog not found');
    }

    const translations = await this.getBlogTranslations([id]);
    const current = pickBlogTranslation(translations, locale);
    if (!current && !locale) {
      throw new Error('Blog translation not found');
    }

    const categoryMap = await this.getCategoryData(
      parent.categoryId ? [parent.categoryId] : [],
    );

    if (!current && locale) {
      const categoryEntry = parent.categoryId
        ? categoryMap.get(parent.categoryId)
        : undefined;

      return {
        data: {
          ...parent,
          locale,
          title: '',
          slug: '',
          description: null,
          content: '',
          translations,
          category: categoryEntry
            ? this.mapCategory(
                categoryEntry.parent,
                categoryEntry.translations,
                locale,
              )
            : null,
        },
      };
    }

    const resolvedTranslation = current;
    if (!resolvedTranslation) {
      throw new Error('Blog translation not found');
    }

    return {
      data: this.mapBlog(
        parent,
        translations,
        resolvedTranslation.locale,
        categoryMap,
      ),
    };
  }

  async getBySlug(slug: string, locale: Locale): Promise<BlogResponse> {
    const validatedLocale = localeEnum.parse(locale);

    const row = await db.query.translation.findFirst({
      where: (t, { eq: e, and: a }) =>
        a(
          e(t.entityType, 'blog'),
          e(t.slug, slug),
          e(t.locale, validatedLocale),
        ),
    });

    if (!row?.blogId) {
      throw new Error('Blog not found');
    }

    return this.getById(row.blogId, validatedLocale);
  }

  async create(data: CreateBlogDto): Promise<BlogResponse> {
    const validated = blogSchema.parse(data);
    await this.assertSlugAvailable(validated.slug, validated.locale);

    const [newBlog] = await db
      .insert(blog)
      .values({
        image: validated.image || null,
        status: validated.status,
        categoryId: validated.categoryId ?? null,
        readingTime: validated.readingTime ?? null,
      })
      .returning();

    await db.insert(translation).values({
      entityType: 'blog',
      blogId: newBlog.id,
      locale: validated.locale,
      slug: validated.slug,
      title: validated.title,
      description: validated.description ?? null,
      content: validated.content,
    });

    return this.getById(newBlog.id, validated.locale);
  }

  async update(id: string, data: UpdateBlogDto): Promise<BlogResponse> {
    const validated = blogUpdateSchema.parse(data);
    const existing = await this.getById(id, validated.locale);
    const targetLocale = validated.locale ?? existing.data.locale;
    const currentTranslation = existing.data.translations?.find(
      (item) => item.locale === targetLocale,
    );

    if (validated.slug) {
      await this.assertSlugAvailable(
        validated.slug,
        targetLocale,
        currentTranslation?.id,
      );
    }

    await db
      .update(blog)
      .set({
        ...(validated.image !== undefined && {
          image: validated.image || null,
        }),
        ...(validated.status !== undefined && { status: validated.status }),
        ...(validated.categoryId !== undefined && {
          categoryId: validated.categoryId ?? null,
        }),
        ...(validated.readingTime !== undefined && {
          readingTime: validated.readingTime ?? null,
        }),
        updatedAt: new Date(),
      })
      .where(eq(blog.id, id));

    if (currentTranslation) {
      await db
        .update(translation)
        .set({
          ...(validated.title !== undefined && { title: validated.title }),
          ...(validated.slug !== undefined && { slug: validated.slug }),
          ...(validated.description !== undefined && {
            description: validated.description ?? null,
          }),
          ...(validated.content !== undefined && {
            content: validated.content,
          }),
          updatedAt: new Date(),
        })
        .where(eq(translation.id, currentTranslation.id));
    } else if (validated.title && validated.slug && validated.content) {
      await db.insert(translation).values({
        entityType: 'blog',
        blogId: id,
        locale: targetLocale,
        slug: validated.slug,
        title: validated.title,
        description: validated.description ?? null,
        content: validated.content,
      });
    } else if (
      validated.title !== undefined ||
      validated.slug !== undefined ||
      validated.description !== undefined ||
      validated.content !== undefined ||
      validated.locale !== undefined
    ) {
      throw new Error(
        'Creating a new translation requires title, slug, and content',
      );
    }

    return this.getById(id, targetLocale);
  }

  async delete(id: string): Promise<void> {
    const [deleted] = await db.delete(blog).where(eq(blog.id, id)).returning();

    if (!deleted) {
      throw new Error('Blog not found');
    }
  }
}

export const blogServiceServer = new BlogServiceServer();
