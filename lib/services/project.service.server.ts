/**
 * Project service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/lib/db';
import { project } from '@/lib/db/schema';
import {
  contentValidator,
  localeEnum,
  slugValidator,
  statusEnum,
  titleValidator,
} from '@/lib/validations/entities';
import type {
  CreateProjectDto,
  Project,
  ProjectListParams,
  ProjectListResponse,
  ProjectResponse,
  UpdateProjectDto,
} from '@/types/entities';
import { and, count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';

export const projectSchema = z.object({
  title: titleValidator,
  slug: slugValidator,
  locale: localeEnum,
  description: z.string().optional(),
  content: contentValidator,
  status: statusEnum,
});

export const projectUpdateSchema = z.object({
  title: titleValidator.optional(),
  slug: slugValidator.optional(),
  locale: localeEnum.optional(),
  description: z.string().optional(),
  content: contentValidator.optional(),
  status: statusEnum.optional(),
});

class ProjectServiceServer {
  /**
   * Get all projects with pagination
   */
  async getAll(params: ProjectListParams = {}): Promise<ProjectListResponse> {
    const { page = 1, limit = 10, status, locale } = params;
    const offset = (page - 1) * limit;

    const conditions = [];
    if (status === 'published' || status === 'draft') {
      conditions.push(eq(project.status, status));
    }
    if (locale === 'fr' || locale === 'en') {
      conditions.push(eq(project.locale, locale));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const projects = await db
      .select()
      .from(project)
      .where(whereClause)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(project.createdAt));

    const totalResult = whereClause
      ? await db.select({ count: count() }).from(project).where(whereClause)
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

    // Check if slug already exists for this locale
    const existing = await db
      .select()
      .from(project)
      .where(
        and(
          eq(project.slug, validated.slug),
          eq(project.locale, validated.locale),
        ),
      )
      .limit(1);
    if (existing.length > 0) {
      throw new Error('Slug already exists for this locale');
    }

    const [newProject] = await db
      .insert(project)
      .values({
        title: validated.title,
        slug: validated.slug,
        locale: validated.locale,
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

    // Check if slug is being changed and if it already exists for the locale
    const targetLocale = validated.locale || existing.locale;
    if (validated.slug && validated.slug !== existing.slug) {
      const slugExists = await db
        .select()
        .from(project)
        .where(
          and(
            eq(project.slug, validated.slug),
            eq(project.locale, targetLocale),
          ),
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
        .from(project)
        .where(
          and(
            eq(project.slug, existing.slug),
            eq(project.locale, validated.locale),
          ),
        )
        .limit(1);
      if (slugExists.length > 0) {
        throw new Error('Slug already exists for this locale');
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
