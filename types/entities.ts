/**
 * Shared entity types inferred from Drizzle schema
 */

import {
  blog,
  category,
  client,
  language,
  newsletterSubscriber,
  project,
  projectReview,
} from '@/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// Inferred from schema (blog and project share these enums)
export type Status = InferSelectModel<typeof blog>['status'];
export type Locale = InferSelectModel<typeof blog>['locale'];

// Entity types inferred from schema
export type Language = InferSelectModel<typeof language>;
export type LanguageInsert = InferInsertModel<typeof language>;
export type Category = InferSelectModel<typeof category>;
export type CategoryInsert = InferInsertModel<typeof category>;
export type Blog = InferSelectModel<typeof blog> & {
  category?: Category | null;
};
export type BlogInsert = InferInsertModel<typeof blog>;
export type Client = InferSelectModel<typeof client>;
export type ClientInsert = InferInsertModel<typeof client>;
export type Project = InferSelectModel<typeof project>;
export type ProjectInsert = InferInsertModel<typeof project>;
export type ProjectReview = InferSelectModel<typeof projectReview>;
export type ProjectReviewInsert = InferInsertModel<typeof projectReview>;
export type NewsletterSubscriber = InferSelectModel<
  typeof newsletterSubscriber
>;
export type NewsletterSubscriberInsert = InferInsertModel<
  typeof newsletterSubscriber
>;

// Admin list row: project review with joined project/client names
export type ProjectReviewAdminRow = ProjectReview & {
  projectTitle: string;
  clientName: string;
};

// DTO types for API (omitting auto-generated fields)
export type CreateCategoryDto = Omit<
  CategoryInsert,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateCategoryDto = Partial<CreateCategoryDto>;
export type CreateBlogDto = Omit<BlogInsert, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBlogDto = Partial<CreateBlogDto>;
export type CreateClientDto = Omit<
  ClientInsert,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateClientDto = Partial<CreateClientDto>;
export type CreateProjectDto = Omit<
  ProjectInsert,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateProjectDto = Partial<CreateProjectDto>;
export type CreateProjectReviewDto = Omit<
  ProjectReviewInsert,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateProjectReviewDto = Partial<
  Omit<
    ProjectReviewInsert,
    'id' | 'projectId' | 'clientId' | 'token' | 'tokenExpiresAt' | 'createdAt'
  >
>;
export type CreateLanguageDto = Omit<
  LanguageInsert,
  'id' | 'createdAt' | 'updatedAt'
>;
export type UpdateLanguageDto = Partial<CreateLanguageDto>;

export type PaginationResponse = {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
};

// Generic API response types (entity T inferred from Drizzle)
export type ListResponse<T> = {
  data: T[];
  pagination: PaginationResponse;
};

export type SingleResponse<T> = {
  data: T;
};

// List params (API query shape, not in schema)
export interface CategoryListParams {
  page?: number;
  limit?: number;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  status?: Status;
  locale?: Locale;
  categoryId?: string;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: Status;
  locale?: Locale;
  clientId?: string;
}

export interface ClientListParams {
  page?: number;
  limit?: number;
}

export interface LanguageListParams {
  page?: number;
  limit?: number;
}

// API response types (using generic + inferred entity types)
export type CategoryListResponse = ListResponse<Category>;
export type CategoryResponse = SingleResponse<Category>;
export type BlogListResponse = ListResponse<Blog>;
export type BlogResponse = SingleResponse<Blog>;
export type ProjectListResponse = ListResponse<Project>;
export type ProjectResponse = SingleResponse<Project>;
export type ClientListResponse = ListResponse<Client>;
export type ClientResponse = SingleResponse<Client>;
export type LanguageListResponse = ListResponse<Language>;
export type LanguageResponse = SingleResponse<Language>;
export type ProjectReviewResponse = SingleResponse<ProjectReview>;
export type ProjectReviewListResponse = ListResponse<ProjectReviewAdminRow>;
export type NewsletterSubscriberListResponse =
  ListResponse<NewsletterSubscriber>;
