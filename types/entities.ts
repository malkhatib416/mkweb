/**
 * Shared entity types inferred from Drizzle schema
 */

import { blog, project } from '@/lib/db/schema';
import { Locale } from '@/locales/i18n';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// Shared enum types
export type Status = 'draft' | 'published';

// Inferred types from schema
export type Blog = InferSelectModel<typeof blog>;
export type BlogInsert = InferInsertModel<typeof blog>;
export type Project = InferSelectModel<typeof project>;
export type ProjectInsert = InferInsertModel<typeof project>;

// DTO types for API (omitting auto-generated fields)
export type CreateBlogDto = Omit<BlogInsert, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBlogDto = Partial<CreateBlogDto>;
export type CreateProjectDto = Omit<
  ProjectInsert,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateProjectDto = Partial<CreateProjectDto>;

// List params
export interface BlogListParams {
  page?: number;
  limit?: number;
  status?: Status;
  locale?: Locale;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: Status;
  locale?: Locale;
}

// API response types
export interface BlogListResponse {
  data: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface BlogResponse {
  data: Blog;
}

export interface ProjectListResponse {
  data: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ProjectResponse {
  data: Project;
}
