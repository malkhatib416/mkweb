/**
 * Language service - Server-side database operations
 */

import { db } from '@/db';
import { language } from '@/db/schema';
import { count, eq } from 'drizzle-orm';
import { z } from 'zod';
import type {
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
