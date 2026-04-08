/**
 * Category service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/db';
import { category, translation } from '@/db/schema';
import { localeEnum, slugValidator } from '@/lib/validations/entities';
import type {
  Category,
  CategoryListParams,
  CategoryListResponse,
  CategoryResponse,
  CategoryTranslation,
  CreateCategoryDto,
  Locale,
  UpdateCategoryDto,
} from '@/types/entities';
import { and, count, desc, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';

const DEFAULT_LOCALE: Locale = 'fr';

export const categorySchema = z.object({
  locale: localeEnum,
  name: z.string().min(1, 'Name is required'),
  slug: slugValidator,
  description: z.string().optional().nullable(),
});

export const categoryUpdateSchema = z.object({
  locale: localeEnum.optional(),
  name: z.string().min(1).optional(),
  slug: slugValidator.optional(),
  description: z.string().optional().nullable(),
});

function pickCategoryTranslation(
  translations: CategoryTranslation[],
  locale?: Locale,
): CategoryTranslation | null {
  if (locale) {
    const exact = translations.find((item) => item.locale === locale);
    if (exact) return exact;
  }

  return (
    translations.find((item) => item.locale === DEFAULT_LOCALE) ??
    translations[0] ??
    null
  );
}

function mapCategory(
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

async function getCategoryTranslations(
  categoryIds: string[],
): Promise<CategoryTranslation[]> {
  if (categoryIds.length === 0) return [];

  const rows = await db
    .select()
    .from(translation)
    .where(
      and(
        eq(translation.entityType, 'category'),
        inArray(translation.categoryId, categoryIds),
      ),
    );

  return rows as CategoryTranslation[];
}

async function assertCategorySlugAvailable(
  slug: string,
  locale: Locale,
  excludeTranslationId?: string,
) {
  const existing = await db.query.translation.findFirst({
    where: (t, { eq: e, and: a, ne: n }) =>
      excludeTranslationId
        ? a(
            e(t.entityType, 'category'),
            e(t.slug, slug),
            e(t.locale, locale),
            n(t.id, excludeTranslationId),
          )
        : a(e(t.entityType, 'category'), e(t.slug, slug), e(t.locale, locale)),
  });

  if (existing) {
    throw new Error('Category slug already exists');
  }
}

export async function getAllCategories(
  params: CategoryListParams = {},
): Promise<CategoryListResponse> {
  const { page = 1, limit = 100, locale = DEFAULT_LOCALE } = params;
  const offset = (page - 1) * limit;

  const rows = await db
    .select({ parent: category, current: translation })
    .from(translation)
    .innerJoin(category, eq(translation.categoryId, category.id))
    .where(
      and(
        eq(translation.entityType, 'category'),
        eq(translation.locale, locale),
      ),
    )
    .orderBy(desc(category.createdAt))
    .limit(limit)
    .offset(offset);

  const [totalResult] = await db
    .select({ count: count() })
    .from(translation)
    .innerJoin(category, eq(translation.categoryId, category.id))
    .where(
      and(
        eq(translation.entityType, 'category'),
        eq(translation.locale, locale),
      ),
    );

  const categoryIds = rows.map((row) => row.parent.id);
  const translations = await getCategoryTranslations(categoryIds);
  const translationMap = new Map<string, CategoryTranslation[]>();

  for (const item of translations) {
    if (!item.categoryId) continue;
    const list = translationMap.get(item.categoryId) ?? [];
    list.push(item);
    translationMap.set(item.categoryId, list);
  }

  return {
    data: rows.map((row) =>
      mapCategory(
        row.parent,
        translationMap.get(row.parent.id) ?? [
          row.current as CategoryTranslation,
        ],
        locale,
      ),
    ),
    pagination: {
      page,
      limit,
      total: totalResult?.count ?? 0,
      pages: Math.max(1, Math.ceil((totalResult?.count ?? 0) / limit)),
    },
  };
}

export async function getCategoryById(
  id: string,
  locale?: Locale,
): Promise<CategoryResponse> {
  const parent = await db.query.category.findFirst({
    where: (c, { eq: e }) => e(c.id, id),
  });

  if (!parent) throw new Error('Category not found');

  const translations = await getCategoryTranslations([id]);
  if (translations.length === 0 && !locale) {
    throw new Error('Category translation not found');
  }

  const current = pickCategoryTranslation(translations, locale);
  if (!current && locale) {
    return {
      data: {
        ...parent,
        locale,
        name: '',
        slug: '',
        description: null,
        translations,
      },
    };
  }

  return { data: mapCategory(parent, translations, locale) };
}

export async function createCategory(
  data: CreateCategoryDto,
): Promise<CategoryResponse> {
  const validated = categorySchema.parse(data);
  await assertCategorySlugAvailable(validated.slug, validated.locale);

  const [created] = await db.insert(category).values({}).returning();

  await db.insert(translation).values({
    entityType: 'category',
    categoryId: created.id,
    locale: validated.locale,
    slug: validated.slug,
    name: validated.name,
    description: validated.description ?? null,
  });

  return getCategoryById(created.id, validated.locale);
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryDto,
): Promise<CategoryResponse> {
  const validated = categoryUpdateSchema.parse(data);
  const existing = await getCategoryById(id, validated.locale);
  const targetLocale = validated.locale ?? existing.data.locale;
  const currentTranslation = existing.data.translations?.find(
    (item) => item.locale === targetLocale,
  );

  if (validated.slug) {
    await assertCategorySlugAvailable(
      validated.slug,
      targetLocale,
      currentTranslation?.id,
    );
  }

  if (currentTranslation) {
    await db
      .update(translation)
      .set({
        ...(validated.name !== undefined && { name: validated.name }),
        ...(validated.slug !== undefined && { slug: validated.slug }),
        ...(validated.description !== undefined && {
          description: validated.description ?? null,
        }),
        updatedAt: new Date(),
      })
      .where(eq(translation.id, currentTranslation.id));
  } else if (validated.name && validated.slug) {
    await db.insert(translation).values({
      entityType: 'category',
      categoryId: id,
      locale: targetLocale,
      slug: validated.slug,
      name: validated.name,
      description: validated.description ?? null,
    });
  } else {
    throw new Error(
      'Creating a new category translation requires name and slug',
    );
  }

  await db
    .update(category)
    .set({ updatedAt: new Date() })
    .where(eq(category.id, id));

  return getCategoryById(id, targetLocale);
}

export async function deleteCategory(id: string): Promise<void> {
  const [deleted] = await db
    .delete(category)
    .where(eq(category.id, id))
    .returning();

  if (!deleted) throw new Error('Category not found');
}
