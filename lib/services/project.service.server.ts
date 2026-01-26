/**
 * Project service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import { eq, count, desc } from 'drizzle-orm';
import { z } from 'zod';
import type {
  Project,
  CreateProjectDto,
  UpdateProjectDto,
  ProjectListResponse,
  ProjectResponse,
  ProjectListParams,
} from './project.service';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  status: z.enum(['draft', 'published']),
});

export const projectUpdateSchema = z.object({
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

class ProjectServiceServer {
  /**
   * Get all projects with pagination
   */
  async getAll(params: ProjectListParams = {}): Promise<ProjectListResponse> {
    const { page = 1, limit = 10, status } = params;
    const offset = (page - 1) * limit;

    let query = db.select().from(project);

    if (status === 'published' || status === 'draft') {
      query = query.where(eq(project.status, status)) as any;
    }

    const projects = await query
      .limit(limit)
      .offset(offset)
      .orderBy(desc(project.createdAt));

    const totalResult = status
      ? await db
          .select({ count: count() })
          .from(project)
          .where(eq(project.status, status))
      : await db.select({ count: count() }).from(project);

    return {
      data: projects as Project[],
      pagination: {
        page,
        limit,
        total: totalResult[0]?.count || 0,
      },
    };
  }

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<ProjectResponse> {
    const [projectItem] = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .limit(1);

    if (!projectItem) {
      throw new Error('Project not found');
    }

    return { data: projectItem as Project };
  }

  /**
   * Create a new project
   */
  async create(data: CreateProjectDto): Promise<ProjectResponse> {
    // Validate input
    const validated = projectSchema.parse(data);

    // Check if slug already exists
    const existing = await db
      .select()
      .from(project)
      .where(eq(project.slug, validated.slug))
      .limit(1);
    if (existing.length > 0) {
      throw new Error('Slug already exists');
    }

    const [newProject] = await db
      .insert(project)
      .values({
        title: validated.title,
        slug: validated.slug,
        description: validated.description || null,
        content: validated.content,
        status: validated.status,
      })
      .returning();

    return { data: newProject as Project };
  }

  /**
   * Update an existing project
   */
  async update(id: string, data: UpdateProjectDto): Promise<ProjectResponse> {
    // Validate input
    const validated = projectUpdateSchema.parse(data);

    // Check if project exists
    const [existing] = await db
      .select()
      .from(project)
      .where(eq(project.id, id))
      .limit(1);
    if (!existing) {
      throw new Error('Project not found');
    }

    // Check if slug is being changed and if it already exists
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(project)
        .where(eq(project.slug, validated.slug))
        .limit(1);
      if (slugExists.length > 0) {
        throw new Error('Slug already exists');
      }
    }

    const [updated] = await db
      .update(project)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(project.id, id))
      .returning();

    return { data: updated as Project };
  }

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    const [deleted] = await db
      .delete(project)
      .where(eq(project.id, id))
      .returning();

    if (!deleted) {
      throw new Error('Project not found');
    }
  }
}

export const projectServiceServer = new ProjectServiceServer();
