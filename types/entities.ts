/**
 * Shared entity types inferred from Drizzle schema
 */

import {
  blog,
  client,
  language,
  newsletterSubscriber,
  project,
  projectReview,
} from '@/db/schema';
import type { Locale } from '@/locales/i18n';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

// Shared enum types
export type Status = 'draft' | 'published';

// Inferred types from schema
export type Language = InferSelectModel<typeof language>;
export type LanguageInsert = InferInsertModel<typeof language>;
export type Blog = InferSelectModel<typeof blog>;
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
export interface BlogListResponse {
  data: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages?: number;
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
    pages?: number;
  };
}

export interface ClientListResponse {
  data: Client[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages?: number;
  };
}

export interface ClientResponse {
  data: Client;
}

export interface LanguageListResponse {
  data: Language[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages?: number;
  };
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
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages?: number;
  };
}
