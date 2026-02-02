/**
 * Category service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/db';
import { category } from '@/db/schema';
import type {
  Category,
  CategoryListParams,
  CategoryListResponse,
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/entities';
import { count, eq } from 'drizzle-orm';
import { z } from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().optional(),
});

export const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .optional(),
  description: z.string().optional(),
});

export async function getAllCategories(
  params: CategoryListParams = {},
): Promise<CategoryListResponse> {
  const { page = 1, limit = 100 } = params;
  const offset = (page - 1) * limit;

  const rows = await db.query.category.findMany({
    orderBy: (c, { asc: a }) => [a(c.name)],
    limit,
    offset,
  });

  const [totalResult] = await db.select({ count: count() }).from(category);
  const total = totalResult?.count ?? 0;

  return {
    data: rows as Category[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  const row = await db.query.category.findFirst({
    where: (c, { eq: e }) => e(c.id, id),
  });

  if (!row) throw new Error('Category not found');
  return { data: row as Category };
}

export async function createCategory(
  data: CreateCategoryDto,
): Promise<CategoryResponse> {
  const validated = categorySchema.parse(data);

  const existing = await db.query.category.findFirst({
    where: (c, { eq: e }) => e(c.slug, validated.slug),
  });
  if (existing) {
    throw new Error('Category slug already exists');
  }

  const [created] = await db
    .insert(category)
    .values({
      name: validated.name,
      slug: validated.slug,
      description: validated.description ?? null,
    })
    .returning();

  return { data: created as Category };
}

export async function updateCategory(
  id: string,
  data: UpdateCategoryDto,
): Promise<CategoryResponse> {
  const validated = categoryUpdateSchema.parse(data);

  const existing = await getCategoryById(id);

  const newSlug = validated.slug;
  if (newSlug != null && newSlug !== existing.data.slug) {
    const slugExists = await db.query.category.findFirst({
      where: (c, { eq: e }) => e(c.slug, newSlug),
    });
    if (slugExists) {
      throw new Error('Category slug already exists');
    }
  }

  const [updated] = await db
    .update(category)
    .set({
      ...(validated.name !== undefined && { name: validated.name }),
      ...(validated.slug !== undefined && { slug: validated.slug }),
      ...(validated.description !== undefined && {
        description: validated.description,
      }),
      updatedAt: new Date(),
    })
    .where(eq(category.id, id))
    .returning();

  if (!updated) throw new Error('Category not found');
  return { data: updated as Category };
}

export async function deleteCategory(id: string): Promise<void> {
  const [deleted] = await db
    .delete(category)
    .where(eq(category.id, id))
    .returning();

  if (!deleted) throw new Error('Category not found');
}
