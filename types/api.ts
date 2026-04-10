import type {
  Blog,
  Category,
  Client,
  Language,
  Locale,
  NewsletterSubscriber,
  Project,
  ProjectReview,
  Status,
} from './entities';

export type PaginationResponse = {
  page?: number;
  limit?: number;
  total?: number;
  pages?: number;
};

export type ListResponse<T> = {
  data: T[];
  pagination: PaginationResponse;
};

export type SingleResponse<T> = {
  data: T;
};

export type ProjectReviewAdminRow = ProjectReview & {
  projectTitle: string;
  clientName: string;
};

export interface CategoryListParams {
  page?: number;
  limit?: number;
  locale?: Locale;
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
