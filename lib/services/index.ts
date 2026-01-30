/**
 * Services index - exports all services and types
 */

// Client-side services (for use in React components)
export { blogService } from './blog.service';
export { clientService } from './client.service';
export { languageService } from './language.service';
export { projectService } from './project.service';

// Server-side services (for use in API routes and server components)
export {
  generateBlogArticle,
  generateObjectFromAI, type GenerateBlogArticleInput,
  type GenerateObjectOptions, type GeneratedArticle
} from './ai.service.server';
export { blogSchema, blogServiceServer, blogUpdateSchema } from './blog.service.server';
export { clientServiceServer } from './client.service.server';
export {
  createLanguage, deleteLanguage, getAllLanguages,
  getLanguageById, languageSchema,
  languageUpdateSchema, updateLanguage
} from './language.service.server';
export { projectSchema, projectServiceServer, projectUpdateSchema } from './project.service.server';

// Re-export types from entities (for convenience)
export type {
  Blog, BlogListParams, BlogListResponse,
  BlogResponse, Client, ClientListParams, ClientListResponse,
  ClientResponse, CreateBlogDto, CreateClientDto, CreateLanguageDto, CreateProjectDto, Language, LanguageListParams, LanguageListResponse,
  LanguageResponse, Project, ProjectListParams, ProjectListResponse,
  ProjectResponse, Status, UpdateBlogDto, UpdateClientDto, UpdateLanguageDto, UpdateProjectDto
} from '@/types/entities';
