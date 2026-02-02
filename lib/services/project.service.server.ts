/**
 * Project service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/db';
import { project } from '@/db/schema';
import {
  contentValidator,
  localeEnum,
  slugValidator,
  statusEnum,
  titleValidator,
} from '@/lib/validations/entities';
import { Locale, isValidLocale } from '@/locales/i18n';
import type {
  CreateProjectDto,
  Project,
  ProjectListParams,
  ProjectListResponse,
  ProjectResponse,
  UpdateProjectDto,
} from '@/types/entities';
import { and, count, eq } from 'drizzle-orm';
import { z } from 'zod';

export const projectSchema = z.object({
  title: titleValidator,
  slug: slugValidator,
  locale: localeEnum,
  description: z.string().optional(),
  content: contentValidator,
  status: statusEnum,
  clientId: z.string().optional().nullable(),
});

export const projectUpdateSchema = z.object({
  title: titleValidator.optional(),
  slug: slugValidator.optional(),
  locale: localeEnum.optional(),
  description: z.string().optional(),
  content: contentValidator.optional(),
  status: statusEnum.optional(),
  clientId: z.string().optional().nullable(),
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
    if (isValidLocale(locale)) {
      conditions.push(eq(project.locale, locale));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const projects = await db.query.project.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: (p, { desc: d }) => [d(p.createdAt)],
    });

    const totalResult = whereClause
      ? await db.select({ count: count() }).from(project).where(whereClause)
      : await db.select({ count: count() }).from(project);

    const total = totalResult[0]?.count || 0;
    return {
      data: projects as Project[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<ProjectResponse> {
    const projectItem = await db.query.project.findFirst({
      where: (p, { eq: e }) => e(p.id, id),
    });

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
    const existing = await db.query.project.findFirst({
      where: (p, { eq: e, and: a }) =>
        a(e(p.slug, validated.slug), e(p.locale, validated.locale)),
    });
    if (existing) {
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
        clientId: validated.clientId ?? null,
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
    const existing = await db.query.project.findFirst({
      where: (p, { eq: e }) => e(p.id, id),
    });
    if (!existing) {
      throw new Error('Project not found');
    }

    // Check if slug is being changed and if it already exists for the locale
    const targetLocale: Locale = validated.locale ?? existing.locale;
    const newSlug = validated.slug;
    if (newSlug != null && newSlug !== existing.slug) {
      const slugExists = await db.query.project.findFirst({
        where: (p, { eq: e, and: a }) =>
          a(e(p.slug, newSlug), e(p.locale, targetLocale)),
      });
      if (slugExists && slugExists.id !== id) {
        throw new Error('Slug already exists for this locale');
      }
    }

    // Check if locale is being changed and if slug exists in new locale
    const newLocale = validated.locale;
    if (newLocale != null && newLocale !== existing.locale) {
      const slugExists = await db.query.project.findFirst({
        where: (p, { eq: e, and: a }) =>
          a(e(p.slug, existing.slug), e(p.locale, newLocale)),
      });
      if (slugExists) {
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

  /**
   * Get published project by slug and locale (public)
   */
  async getPublishedBySlug(
    slug: string,
    locale: Locale,
  ): Promise<Project | null> {
    const row = await db.query.project.findFirst({
      where: (p, { eq: e, and: a }) =>
        a(e(p.slug, slug), e(p.locale, locale), e(p.status, 'published')),
    });
    return (row as Project) ?? null;
  }

  /**
   * Get published projects for a locale (public)
   */
  async getPublished(locale: Locale, limit: number = 50): Promise<Project[]> {
    const rows = await db.query.project.findMany({
      where: (p, { eq: e, and: a }) =>
        a(e(p.locale, locale), e(p.status, 'published')),
      orderBy: (p, { desc: d }) => [d(p.createdAt)],
      limit,
    });
    return rows as Project[];
  }
}

export const projectServiceServer = new ProjectServiceServer();
