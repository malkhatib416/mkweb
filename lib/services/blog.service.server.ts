/**
 * Blog service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/lib/db';
import { blog } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { z } from 'zod';
import type {
  Blog,
  CreateBlogDto,
  UpdateBlogDto,
  BlogListResponse,
  BlogResponse,
  BlogListParams,
} from './blog.service';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']),
});

export const blogUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format')
    .optional(),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required').optional(),
  status: z.enum(['draft', 'published']).optional(),
});

class BlogServiceServer {
  /**
   * Get all blogs with pagination
   */
  async getAll(params: BlogListParams = {}): Promise<BlogListResponse> {
    const { page = 1, limit = 10, status } = params;
    const offset = (page - 1) * limit;

    let query = db.select().from(blog);

    if (status === 'published' || status === 'draft') {
      query = query.where(eq(blog.status, status)) as any;
    }

    const blogs = await query
      .limit(limit)
      .offset(offset)
      .orderBy(desc(blog.createdAt));

    const totalResult = status
      ? await db
          .select({ count: count() })
          .from(blog)
          .where(eq(blog.status, status))
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

    // Check if slug already exists
    const existing = await db
      .select()
      .from(blog)
      .where(eq(blog.slug, validated.slug))
      .limit(1);
    if (existing.length > 0) {
      throw new Error('Slug already exists');
    }

    const [newBlog] = await db
      .insert(blog)
      .values({
        title: validated.title,
        slug: validated.slug,
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

    // Check if slug is being changed and if it already exists
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(blog)
        .where(eq(blog.slug, validated.slug))
        .limit(1);
      if (slugExists.length > 0) {
        throw new Error('Slug already exists');
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
