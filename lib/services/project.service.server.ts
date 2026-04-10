/**
 * Project service - Server-side database operations
 * Used by API routes and server components
 */

import { db } from '@/db';
import { project, translation } from '@/db/schema';
import {
  mapProjectFromTranslations,
  pickProjectTranslation,
} from '@/lib/services/project-translations';
import {
  contentValidator,
  slugValidator,
  statusEnum,
  titleValidator,
} from '@/lib/validations/entities';
import {
  defaultLocale,
  isValidLocale,
  locales,
  type Locale,
} from '@/locales/i18n';
import type {
  CreateProjectDto,
  Project,
  ProjectListParams,
  ProjectListResponse,
  ProjectTranslation,
  ProjectResponse,
  UpdateProjectDto,
} from '@/types/entities';
import { and, count, eq } from 'drizzle-orm';
import { z } from 'zod';

const projectLocaleEnum = z.enum(locales);

function hasProjectRelation<
  T extends { project: typeof project.$inferSelect | null },
>(row: T): row is T & { project: typeof project.$inferSelect } {
  return row.project !== null;
}

export const projectSchema = z.object({
  title: titleValidator,
  slug: slugValidator,
  locale: projectLocaleEnum,
  description: z.string().optional(),
  content: contentValidator,
  status: statusEnum,
  clientId: z.string().optional().nullable(),
});

export const projectUpdateSchema = z.object({
  title: titleValidator.optional(),
  slug: slugValidator.optional(),
  locale: projectLocaleEnum.optional(),
  description: z.string().optional(),
  content: contentValidator.optional(),
  status: statusEnum.optional(),
  clientId: z.string().optional().nullable(),
});

class ProjectServiceServer {
  private async getProjectWithTranslations(id: string) {
    return db.query.project.findFirst({
      where: (p, { eq: e }) => e(p.id, id),
      with: {
        translations: {
          where: (t, { eq: e }) => e(t.entityType, 'project'),
        },
      },
    });
  }

  private async assertProjectSlugAvailable(
    slug: string,
    locale: Locale,
    excludeTranslationId?: string,
  ) {
    const existing = await db.query.translation.findFirst({
      where: (t, { eq: e, and: a, ne: n }) =>
        excludeTranslationId
          ? a(
              e(t.entityType, 'project'),
              e(t.slug, slug),
              e(t.locale, locale),
              n(t.id, excludeTranslationId),
            )
          : a(e(t.entityType, 'project'), e(t.slug, slug), e(t.locale, locale)),
    });

    if (existing) {
      throw new Error('Slug already exists for this locale');
    }
  }

  /**
   * Get all projects with pagination
   */
  async getAll(params: ProjectListParams = {}): Promise<ProjectListResponse> {
    const { page = 1, limit = 10, status, locale, clientId } = params;
    const offset = (page - 1) * limit;

    const projectWhere = [];
    if (status === 'published' || status === 'draft') {
      projectWhere.push(eq(project.status, status));
    }
    if (clientId) {
      projectWhere.push(eq(project.clientId, clientId));
    }
    let projects: Project[];
    let total: number;

    if (isValidLocale(locale)) {
      const translatedRows = await db.query.translation.findMany({
        where: (t, { eq: e, and: a }) =>
          a(e(t.entityType, 'project'), e(t.locale, locale)),
        with: {
          project: {
            with: {
              translations: {
                where: (t, { eq: e }) => e(t.entityType, 'project'),
              },
            },
          },
        },
      });

      const filteredRows = translatedRows
        .filter(hasProjectRelation)
        .filter((row) =>
          status === 'published' || status === 'draft'
            ? row.project.status === status
            : true,
        )
        .filter((row) => (clientId ? row.project.clientId === clientId : true))
        .sort(
          (left, right) =>
            right.project.createdAt.getTime() -
            left.project.createdAt.getTime(),
        );

      total = filteredRows.length;
      projects = filteredRows
        .slice(offset, offset + limit)
        .map((row) =>
          mapProjectFromTranslations(
            row.project,
            row.project.translations as ProjectTranslation[],
            locale,
          ),
        );
    } else {
      const rows = await db.query.project.findMany({
        where: projectWhere.length > 0 ? and(...projectWhere) : undefined,
        orderBy: (p, { desc: d }) => [d(p.createdAt)],
        limit,
        offset,
        with: {
          translations: {
            where: (t, { eq: e }) => e(t.entityType, 'project'),
          },
        },
      });

      const totalResult = await db
        .select({ count: count() })
        .from(project)
        .where(projectWhere.length > 0 ? and(...projectWhere) : undefined);

      total = totalResult[0]?.count || 0;
      projects = rows.map((row) =>
        mapProjectFromTranslations(
          row,
          row.translations as ProjectTranslation[],
          undefined,
        ),
      );
    }

    return {
      data: projects,
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
  async getById(id: string, locale?: Locale): Promise<ProjectResponse> {
    const projectItem = await this.getProjectWithTranslations(id);

    if (!projectItem) {
      throw new Error('Project not found');
    }

    const translations = projectItem.translations as ProjectTranslation[];
    const exactTranslation = locale
      ? translations.find((item) => item.locale === locale)
      : undefined;

    if (locale && !exactTranslation) {
      return {
        data: {
          ...projectItem,
          locale,
          title: '',
          slug: '',
          description: null,
          content: '',
          translations,
        },
      };
    }

    return {
      data: mapProjectFromTranslations(projectItem, translations, locale),
    };
  }

  /**
   * Create a new project
   */
  async create(data: CreateProjectDto): Promise<ProjectResponse> {
    // Validate input
    const validated = projectSchema.parse(data);

    await this.assertProjectSlugAvailable(validated.slug, validated.locale);

    const [newProject] = await db
      .insert(project)
      .values({
        status: validated.status,
        clientId: validated.clientId ?? null,
      })
      .returning();

    await db.insert(translation).values({
      entityType: 'project',
      projectId: newProject.id,
      locale: validated.locale,
      slug: validated.slug,
      title: validated.title,
      description: validated.description ?? null,
      content: validated.content,
    });

    return this.getById(newProject.id, validated.locale);
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

    const projectWithTranslations = await this.getProjectWithTranslations(id);
    const translations =
      (projectWithTranslations?.translations as ProjectTranslation[]) ?? [];
    const pickedLocale = pickProjectTranslation(
      translations,
      undefined,
    )?.locale;
    const targetLocale: Locale =
      validated.locale ??
      (isValidLocale(pickedLocale) ? pickedLocale : undefined) ??
      defaultLocale;
    const currentTranslation = translations.find(
      (item) => item.locale === targetLocale,
    );

    if (validated.slug) {
      await this.assertProjectSlugAvailable(
        validated.slug,
        targetLocale,
        currentTranslation?.id,
      );
    }

    if (currentTranslation) {
      await db
        .update(translation)
        .set({
          ...(validated.title !== undefined && { title: validated.title }),
          ...(validated.slug !== undefined && { slug: validated.slug }),
          ...(validated.description !== undefined && {
            description: validated.description ?? null,
          }),
          ...(validated.content !== undefined && {
            content: validated.content,
          }),
          updatedAt: new Date(),
        })
        .where(eq(translation.id, currentTranslation.id));
    } else if (validated.title && validated.slug && validated.content) {
      await db.insert(translation).values({
        entityType: 'project',
        projectId: id,
        locale: targetLocale,
        slug: validated.slug,
        title: validated.title,
        description: validated.description ?? null,
        content: validated.content,
      });
    } else {
      throw new Error(
        'Creating a new project translation requires title, slug and content',
      );
    }

    await db
      .update(project)
      .set({
        ...(validated.status !== undefined && { status: validated.status }),
        ...(validated.clientId !== undefined && {
          clientId: validated.clientId,
        }),
        updatedAt: new Date(),
      })
      .where(eq(project.id, id));

    return this.getById(id, targetLocale);
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
    const translationItem = await db.query.translation.findFirst({
      where: (t, { eq: e, and: a }) =>
        a(e(t.entityType, 'project'), e(t.slug, slug), e(t.locale, locale)),
      with: {
        project: {
          with: {
            translations: {
              where: (t, { eq: e }) => e(t.entityType, 'project'),
            },
          },
        },
      },
    });

    if (
      !translationItem?.project ||
      translationItem.project.status !== 'published'
    ) {
      return null;
    }

    return mapProjectFromTranslations(
      translationItem.project,
      translationItem.project.translations as ProjectTranslation[],
      locale,
    );
  }

  /**
   * Get published projects for a locale (public)
   */
  async getPublished(locale: Locale, limit: number = 50): Promise<Project[]> {
    const rows = await db.query.translation.findMany({
      where: (t, { eq: e, and: a }) =>
        a(e(t.entityType, 'project'), e(t.locale, locale)),
      with: {
        project: {
          with: {
            translations: {
              where: (t, { eq: e }) => e(t.entityType, 'project'),
            },
          },
        },
      },
    });

    return rows
      .filter(hasProjectRelation)
      .filter((row) => row.project.status === 'published')
      .sort(
        (left, right) =>
          right.project.createdAt.getTime() - left.project.createdAt.getTime(),
      )
      .slice(0, limit)
      .map((row) =>
        mapProjectFromTranslations(
          row.project,
          row.project.translations as ProjectTranslation[],
          locale,
        ),
      );
  }
}

export const projectServiceServer = new ProjectServiceServer();
