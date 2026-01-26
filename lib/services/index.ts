/**
 * Services index - exports all services and types
 */

// Client-side services (for use in React components)
export * from './blog.service';
export * from './project.service';

// Server-side services (for use in API routes and server components)
export { blogServiceServer } from './blog.service.server';
export { projectServiceServer } from './project.service.server';
export { blogSchema, blogUpdateSchema } from './blog.service.server';
export { projectSchema, projectUpdateSchema } from './project.service.server';
