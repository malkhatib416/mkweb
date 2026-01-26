/**
 * Services index - exports all services and types
 */

// Client-side services (for use in React components)
export { blogService } from './blog.service';
export { projectService } from './project.service';

// Server-side services (for use in API routes and server components)
export { blogServiceServer } from './blog.service.server';
export { projectServiceServer } from './project.service.server';
export { blogSchema, blogUpdateSchema } from './blog.service.server';
export { projectSchema, projectUpdateSchema } from './project.service.server';

// Re-export types from entities (for convenience)
export type {
  Blog,
  Project,
  CreateBlogDto,
  UpdateBlogDto,
  CreateProjectDto,
  UpdateProjectDto,
  BlogListResponse,
  BlogResponse,
  ProjectListResponse,
  ProjectResponse,
  BlogListParams,
  ProjectListParams,
  Locale,
  Status,
} from '@/types/entities';
