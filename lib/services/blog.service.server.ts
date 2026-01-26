/**
 * Blog service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/lib/db';
import { blog } from '@/lib/db/schema';
import { eq, count, desc, and } from 'drizzle-orm';
import { z } from 'zod';
import type {
  Blog,
  CreateBlogDto,
  UpdateBlogDto,
  BlogListResponse,
  BlogResponse,
  BlogListParams,
} from '@/types/entities';
import {
  localeEnum,
  statusEnum,
  slugValidator,
  titleValidator,
  contentValidator,
} from '@/lib/validations/entities';

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
    if (locale === 'fr' || locale === 'en') {
      conditions.push(eq(blog.locale, locale));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const blogs = await db
      .select()
      .from(blog)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(blog.createdAt));

    const totalResult = whereClause
      ? await db.select({ count: count() }).from(blog).where(whereClause)
      : await db.select({ count: count() }).from(blog);

    return {
      data: blogs as Blog[],
      pagination: {
        page,
        limit,
        total: totalResult[0]?.count || 0,
      },
    };
  }

  /**
   * Get a single blog by ID
   */
  async getById(id: string): Promise<BlogResponse> {
    const [blogPost] = await db
      .select()
      .from(blog)
      .where(eq(blog.id, id))
      .limit(1);

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
    const existing = await db
      .select()
      .from(blog)
      .where(
        and(eq(blog.slug, validated.slug), eq(blog.locale, validated.locale)),
      )
      .limit(1);
    if (existing.length > 0) {
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
    const [existing] = await db
      .select()
      .from(blog)
      .where(eq(blog.id, id))
      .limit(1);
    if (!existing) {
      throw new Error('Blog not found');
    }

    // Check if slug is being changed and if it already exists for the locale
    const targetLocale = validated.locale || existing.locale;
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(blog)
        .where(
          and(eq(blog.slug, validated.slug), eq(blog.locale, targetLocale)),
        )
        .limit(1);
      if (slugExists.length > 0 && slugExists[0].id !== id) {
        throw new Error('Slug already exists for this locale');
      }
    }

    // Check if locale is being changed and if slug exists in new locale
    if (validated.locale && validated.locale !== existing.locale) {
      const slugExists = await db
        .select()
        .from(blog)
        .where(
          and(eq(blog.slug, existing.slug), eq(blog.locale, validated.locale)),
        )
        .limit(1);
      if (slugExists.length > 0) {
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
