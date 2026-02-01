/**
 * Blog service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/db';
import { blog } from '@/db/schema';
import {
  contentValidator,
  localeEnum,
  readingTimeValidator,
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
  description: z.string().optional(),
  image: z.string().url().optional().or(z.literal('')),
  content: contentValidator.optional(),
  status: statusEnum.optional(),
  categoryId: z.string().optional().nullable(),
  readingTime: readingTimeValidator,
});

class BlogServiceServer {
  /**
   * Get all blogs with pagination
   */
  async getAll(params: BlogListParams = {}): Promise<BlogListResponse> {
    const { page = 1, limit = 10, status, locale, categoryId } = params;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status === 'published' || status === 'draft') {
      conditions.push(eq(blog.status, status));
    }
    if (isValidLocale(locale)) {
      conditions.push(eq(blog.locale, locale));
    }
    if (categoryId) {
      conditions.push(eq(blog.categoryId, categoryId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const blogs = await db.query.blog.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (b, { desc: d }) => [d(b.createdAt)],
      with: { category: true },
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
      with: { category: true },
    });

    if (!blogPost) {
      throw new Error('Blog not found');
    }

    return { data: blogPost as Blog };
  }

  /**
   * Get a single blog by slug and locale (for public URLs)
   */
  async getBySlug(slug: string, locale: Locale): Promise<BlogResponse> {
    if (!isValidLocale(locale)) {
      throw new Error('Invalid locale');
    }
    const blogPost = await db.query.blog.findFirst({
      where: (b, { eq: e, and: a }) => a(e(b.slug, slug), e(b.locale, locale)),
      with: { category: true },
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
        image: validated.image || null,
        content: validated.content,
        status: validated.status,
        categoryId: validated.categoryId ?? null,
        readingTime: validated.readingTime ?? null,
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
    const existing = await this.getById(id);

    // Check if slug is being changed and if it already exists for the locale
    const targetLocale: Locale = validated.locale ?? existing.data.locale;
    const newSlug = validated.slug;
    if (newSlug != null && newSlug !== existing.data.slug) {
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
    if (newLocale != null && newLocale !== existing.data.locale) {
      const slugExists = await db.query.blog.findFirst({
        where: (b, { eq: e, and: a }) =>
          a(e(b.slug, existing.data.slug), e(b.locale, newLocale)),
      });
      if (slugExists) {
        throw new Error('Slug already exists for this locale');
      }
    }

    const [updated] = await db
      .update(blog)
      .set({
        ...(validated.title !== undefined && { title: validated.title }),
        ...(validated.slug !== undefined && { slug: validated.slug }),
        ...(validated.locale !== undefined && { locale: validated.locale }),
        ...(validated.description !== undefined && {
          description: validated.description,
        }),
        ...(validated.image !== undefined && {
          image: validated.image || null,
        }),
        ...(validated.content !== undefined && { content: validated.content }),
        ...(validated.status !== undefined && { status: validated.status }),
        ...(validated.categoryId !== undefined && {
          categoryId: validated.categoryId,
        }),
        ...(validated.readingTime !== undefined && {
          readingTime: validated.readingTime,
        }),
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
