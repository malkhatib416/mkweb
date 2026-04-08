/**
 * Services index - exports all services and types
 */

// Client-side services (for use in React components)
export { blogService } from './blog.service';
export { categoryService } from './category.service';
export { clientService } from './client.service';
export { languageService } from './language.service';
export { newsletterService } from './newsletter.service';
export { projectReviewService } from './project-review.service';
export { projectService } from './project.service';

// Server-side services (for use in API routes and server components)
export {
  generateBlogArticle,
  generateObjectFromAI,
  type GenerateBlogArticleInput,
  type GenerateObjectOptions,
  type GeneratedArticle,
} from './ai.service.server';
export {
  blogSchema,
  blogServiceServer,
  blogUpdateSchema,
} from './blog.service.server';
export {
  categorySchema,
  categoryUpdateSchema,
  getAllCategories,
  getCategoryById,
} from './category.service.server';
export { clientServiceServer } from './client.service.server';
export {
  createLanguage,
  deleteLanguage,
  getAllLanguages,
  getLanguageById,
  languageSchema,
  languageUpdateSchema,
  updateLanguage,
} from './language.service.server';
export {
  projectSchema,
  projectServiceServer,
  projectUpdateSchema,
} from './project.service.server';

export type {
  Blog,
  Category,
  Client,
  Language,
  Project,
  Status,
} from '@/types/entities';
export type {
  BlogListParams,
  BlogListResponse,
  BlogResponse,
  CategoryListParams,
  CategoryListResponse,
  CategoryResponse,
  ClientListParams,
  ClientListResponse,
  ClientResponse,
  LanguageListParams,
  LanguageListResponse,
  LanguageResponse,
  ProjectListParams,
  ProjectListResponse,
  ProjectResponse,
  ProjectReviewAdminRow,
  ProjectReviewListResponse,
} from '@/types/api';
export type {
  CreateBlogDto,
  CreateCategoryDto,
  CreateClientDto,
  CreateLanguageDto,
  CreateProjectDto,
  UpdateBlogDto,
  UpdateCategoryDto,
  UpdateClientDto,
  UpdateLanguageDto,
  UpdateProjectDto,
} from '@/types/dto';
