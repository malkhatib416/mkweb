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
import type { Locale } from '@/locales/i18n';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

// Shared enum types
export type Status = 'draft' | 'published';

// Inferred types from schema
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
}

// List params
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

// API response types
export interface CategoryListResponse {
  data: Category[];
  pagination: PaginationResponse;
}

export interface CategoryResponse {
  data: Category;
}

export interface BlogListResponse {
  data: Blog[];
  pagination: PaginationResponse;
}

export interface BlogResponse {
  data: Blog;
}

export interface ProjectListResponse {
  data: Project[];
  pagination: PaginationResponse;
}

export interface ClientListResponse {
  data: Client[];
  pagination: PaginationResponse;
}

export interface ClientResponse {
  data: Client;
}

export interface LanguageListResponse {
  data: Language[];
  pagination: PaginationResponse;
}

export interface LanguageResponse {
  data: Language;
}

export interface ProjectResponse {
  data: Project;
}

export interface ProjectReviewResponse {
  data: ProjectReview;
}

export interface NewsletterSubscriberListResponse {
  data: NewsletterSubscriber[];
  pagination: PaginationResponse;
}
