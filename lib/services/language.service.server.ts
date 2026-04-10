/**
 * Language service - Server-side database operations
 */

import { db } from '@/db';
import { blog, category, language, translation } from '@/db/schema';
import {
  translateBlogContent,
  translateCategoryContent,
} from '@/lib/services/ai.service.server';
import { defaultLocale } from '@/locales/i18n';
import { generateSlug } from '@/utils/utils';
import { count, eq } from 'drizzle-orm';
import { z } from 'zod';
import type {
  BlogTranslation,
  CategoryTranslation,
  Language,
  LanguageListParams,
  LanguageListResponse,
  LanguageResponse,
  CreateLanguageDto,
  UpdateLanguageDto,
} from '@/types/entities';

export const languageSchema = z.object({
  code: z.string().min(1, 'Code is required').max(10),
  name: z.string().min(1, 'Name is required'),
});

export const languageUpdateSchema = z.object({
  code: z.string().min(1).max(10).optional(),
  name: z.string().min(1).optional(),
});

function pickSourceTranslation<T extends { locale: string }>(
  translations: T[],
) {
  return (
    translations.find((item) => item.locale === defaultLocale) ??
    translations[0] ??
    null
  );
}

async function ensureUniqueTranslationSlug(
  entityType: 'blog' | 'category',
  locale: string,
  input: string,
) {
  const normalizedBase = generateSlug(input) || `${entityType}-${Date.now()}`;
  let candidate = normalizedBase;
  let suffix = 2;

  while (true) {
    const existing = await db.query.translation.findFirst({
      where: (t, { and: a, eq: e }) =>
        a(
          e(t.entityType, entityType),
          e(t.locale, locale),
          e(t.slug, candidate),
        ),
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${normalizedBase}-${suffix}`;
    suffix += 1;
  }
}

async function backfillBlogTranslations(target: {
  code: string;
  name: string;
}) {
  const [blogs, blogTranslations] = await Promise.all([
    db.select({ id: blog.id }).from(blog),
    db.select().from(translation).where(eq(translation.entityType, 'blog')),
  ]);

  const translationsByBlogId = new Map<string, BlogTranslation[]>();

  for (const item of blogTranslations as BlogTranslation[]) {
    if (!item.blogId) continue;
    const list = translationsByBlogId.get(item.blogId) ?? [];
    list.push(item);
    translationsByBlogId.set(item.blogId, list);
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const currentBlog of blogs) {
    const existingTranslations = translationsByBlogId.get(currentBlog.id) ?? [];
    if (existingTranslations.some((item) => item.locale === target.code)) {
      continue;
    }

    const source = pickSourceTranslation(
      existingTranslations.filter((item): item is BlogTranslation =>
        Boolean(item.title && item.content),
      ),
    );

    if (!source?.title || !source.content) {
      skippedCount += 1;
      console.warn(
        `Skipping blog ${currentBlog.id} during language backfill: no usable source translation found`,
      );
      continue;
    }

    const localized = await translateBlogContent({
      sourceLanguageCode: source.locale,
      targetLanguageCode: target.code,
      targetLanguageName: target.name,
      title: source.title,
      slug: source.slug,
      description: source.description,
      content: source.content,
    });

    const uniqueSlug = await ensureUniqueTranslationSlug(
      'blog',
      target.code,
      localized.slug || localized.title || source.slug,
    );

    await db.insert(translation).values({
      entityType: 'blog',
      blogId: currentBlog.id,
      locale: target.code,
      slug: uniqueSlug,
      title: localized.title,
      description: localized.description || null,
      content: localized.content,
    });

    await db
      .update(blog)
      .set({ updatedAt: new Date() })
      .where(eq(blog.id, currentBlog.id));

    createdCount += 1;
  }

  return {
    createdCount,
    skippedCount,
  };
}

async function backfillCategoryTranslations(target: {
  code: string;
  name: string;
}) {
  const [categories, categoryTranslations] = await Promise.all([
    db.select({ id: category.id }).from(category),
    db.select().from(translation).where(eq(translation.entityType, 'category')),
  ]);

  const translationsByCategoryId = new Map<string, CategoryTranslation[]>();

  for (const item of categoryTranslations as CategoryTranslation[]) {
    if (!item.categoryId) continue;
    const list = translationsByCategoryId.get(item.categoryId) ?? [];
    list.push(item);
    translationsByCategoryId.set(item.categoryId, list);
  }

  let createdCount = 0;
  let skippedCount = 0;

  for (const currentCategory of categories) {
    const existingTranslations =
      translationsByCategoryId.get(currentCategory.id) ?? [];

    if (existingTranslations.some((item) => item.locale === target.code)) {
      continue;
    }

    const source = pickSourceTranslation(
      existingTranslations.filter((item): item is CategoryTranslation =>
        Boolean(item.name),
      ),
    );

    if (!source?.name) {
      skippedCount += 1;
      console.warn(
        `Skipping category ${currentCategory.id} during language backfill: no usable source translation found`,
      );
      continue;
    }

    const localized = await translateCategoryContent({
      sourceLanguageCode: source.locale,
      targetLanguageCode: target.code,
      targetLanguageName: target.name,
      name: source.name,
      slug: source.slug,
      description: source.description,
    });

    const uniqueSlug = await ensureUniqueTranslationSlug(
      'category',
      target.code,
      localized.slug || localized.name || source.slug,
    );

    await db.insert(translation).values({
      entityType: 'category',
      categoryId: currentCategory.id,
      locale: target.code,
      slug: uniqueSlug,
      name: localized.name,
      description: localized.description,
    });

    await db
      .update(category)
      .set({ updatedAt: new Date() })
      .where(eq(category.id, currentCategory.id));

    createdCount += 1;
  }

  return {
    createdCount,
    skippedCount,
  };
}

async function backfillTranslationsForLanguage(target: {
  code: string;
  name: string;
}) {
  const [blogResult, categoryResult] = await Promise.all([
    backfillBlogTranslations(target),
    backfillCategoryTranslations(target),
  ]);

  return {
    blogCount: blogResult.createdCount,
    skippedBlogs: blogResult.skippedCount,
    categoryCount: categoryResult.createdCount,
    skippedCategories: categoryResult.skippedCount,
  };
}

export async function getAllLanguages(
  params: LanguageListParams = {},
): Promise<LanguageListResponse> {
  const { page = 1, limit = 50 } = params;
  const offset = (page - 1) * limit;

  const rows = await db.query.language.findMany({
    orderBy: (l, { asc: a }) => [a(l.code)],
    limit,
    offset,
  });

  const [totalResult] = await db.select({ count: count() }).from(language);
  const total = totalResult?.count ?? 0;

  return {
    data: rows as Language[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getLanguageById(id: string): Promise<LanguageResponse> {
  const row = await db.query.language.findFirst({
    where: (l, { eq: e }) => e(l.id, id),
  });

  if (!row) throw new Error('Language not found');
  return { data: row as Language };
}

export async function createLanguage(
  data: CreateLanguageDto,
): Promise<LanguageResponse> {
  const validated = languageSchema.parse(data);

  const existing = await db.query.language.findFirst({
    where: (l, { eq: e }) => e(l.code, validated.code),
  });
  if (existing) {
    throw new Error('Language code already exists');
  }

  const [created] = await db
    .insert(language)
    .values({
      code: validated.code,
      name: validated.name,
    })
    .returning();

  try {
    await backfillTranslationsForLanguage(created);
  } catch (error) {
    await db.delete(translation).where(eq(translation.locale, created.code));
    await db.delete(language).where(eq(language.id, created.id));
    throw error;
  }

  return { data: created as Language };
}

export async function updateLanguage(
  id: string,
  data: UpdateLanguageDto,
): Promise<LanguageResponse> {
  const validated = languageUpdateSchema.parse(data);

  const existing = await db.query.language.findFirst({
    where: (l, { eq: e }) => e(l.id, id),
  });
  if (!existing) throw new Error('Language not found');

  const newCode = validated.code;
  if (newCode != null && newCode !== existing.code) {
    const codeExists = await db.query.language.findFirst({
      where: (l, { eq: e }) => e(l.code, newCode),
    });
    if (codeExists) {
      throw new Error('Language code already exists');
    }
  }

  const [updated] = await db
    .update(language)
    .set({
      ...validated,
      updatedAt: new Date(),
    })
    .where(eq(language.id, id))
    .returning();

  if (!updated) throw new Error('Language not found');
  return { data: updated as Language };
}

export async function deleteLanguage(id: string): Promise<void> {
  const [deleted] = await db
    .delete(language)
    .where(eq(language.id, id))
    .returning();

  if (!deleted) throw new Error('Language not found');
}
