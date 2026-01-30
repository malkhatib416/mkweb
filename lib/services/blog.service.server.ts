/**
 * Blog service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/db';
import { blog } from '@/db/schema';
import {
  contentValidator,
  localeEnum,
  slugValidator,
  statusEnum,
  titleValidator,
} from '@/lib/validations/entities';
import { Locale, isValidLocale } from '@/locales/i18n';
import type {
  Blog,
  BlogListParams,
  BlogListResponse,
  BlogResponse,
  CreateBlogDto,
  UpdateBlogDto,
} from '@/types/entities';
import { and, count, eq } from 'drizzle-orm';
import { z } from 'zod';

export const blogSchema = z.object({
  title: titleValidator,
  slug: slugValidator,
  locale: localeEnum,
  description: z.string().optional(),
  content: contentValidator,
  status: statusEnum,
});

export const blogUpdateSchema = z.object({
  title: titleValidator.optional(),
  slug: slugValidator.optional(),
  locale: localeEnum.optional(),
  description: z.string().optional(),
  content: contentValidator.optional(),
  status: statusEnum.optional(),
});

class BlogServiceServer {
  /**
   * Get all blogs with pagination
   */
  async getAll(params: BlogListParams = {}): Promise<BlogListResponse> {
    const { page = 1, limit = 10, status, locale } = params;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status === 'published' || status === 'draft') {
      conditions.push(eq(blog.status, status));
    }
    if (isValidLocale(locale)) {
      conditions.push(eq(blog.locale, locale));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const blogs = await db.query.blog.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (b, { desc: d }) => [d(b.createdAt)],
    });

    const totalResult = whereClause
      ? await db.select({ count: count() }).from(blog).where(whereClause)
      : await db.select({ count: count() }).from(blog);

    const total = totalResult[0]?.count || 0;
    return {
      data: blogs as Blog[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  /**
   * Get a single blog by ID
   */
  async getById(id: string): Promise<BlogResponse> {
    const blogPost = await db.query.blog.findFirst({
      where: (b, { eq: e }) => e(b.id, id),
    });

    if (!blogPost) {
      throw new Error('Blog not found');
    }

    return { data: blogPost as Blog };
  }

  /**
   * Create a new blog
   */
  async create(data: CreateBlogDto): Promise<BlogResponse> {
    // Validate input
    const validated = blogSchema.parse(data);

    // Check if slug already exists for this locale
    const existing = await db.query.blog.findFirst({
      where: (b, { eq: e, and: a }) =>
        a(e(b.slug, validated.slug), e(b.locale, validated.locale)),
    });
    if (existing) {
      throw new Error('Slug already exists for this locale');
    }

    const [newBlog] = await db
      .insert(blog)
      .values({
        title: validated.title,
        slug: validated.slug,
        locale: validated.locale,
        description: validated.description || null,
        content: validated.content,
        status: validated.status,
      })
      .returning();

    return { data: newBlog as Blog };
  }

  /**
   * Update an existing blog
   */
  async update(id: string, data: UpdateBlogDto): Promise<BlogResponse> {
    // Validate input
    const validated = blogUpdateSchema.parse(data);

    // Check if blog exists
    const existing = await db.query.blog.findFirst({
      where: (b, { eq: e }) => e(b.id, id),
    });
    if (!existing) {
      throw new Error('Blog not found');
    }

    // Check if slug is being changed and if it already exists for the locale
    const targetLocale: Locale = validated.locale ?? existing.locale;
    const newSlug = validated.slug;
    if (newSlug != null && newSlug !== existing.slug) {
      const slugExists = await db.query.blog.findFirst({
        where: (b, { eq: e, and: a }) =>
          a(e(b.slug, newSlug), e(b.locale, targetLocale)),
      });
      if (slugExists && slugExists.id !== id) {
        throw new Error('Slug already exists for this locale');
      }
    }

    // Check if locale is being changed and if slug exists in new locale
    const newLocale = validated.locale;
    if (newLocale != null && newLocale !== existing.locale) {
      const slugExists = await db.query.blog.findFirst({
        where: (b, { eq: e, and: a }) =>
          a(e(b.slug, existing.slug), e(b.locale, newLocale)),
      });
      if (slugExists) {
        throw new Error('Slug already exists for this locale');
      }
    }

    const [updated] = await db
      .update(blog)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(blog.id, id))
      .returning();

    return { data: updated as Blog };
  }

  /**
   * Delete a blog
   */
  async delete(id: string): Promise<void> {
    const [deleted] = await db.delete(blog).where(eq(blog.id, id)).returning();

    if (!deleted) {
      throw new Error('Blog not found');
    }
  }
}

export const blogServiceServer = new BlogServiceServer();
