import type {
  Blog,
  Category,
  ClientInsert,
  LanguageInsert,
  ProjectInsert,
  ProjectReviewInsert,
} from './entities';

export type CreateCategoryDto = Omit<
  Category,
  'id' | 'createdAt' | 'updatedAt' | 'translations'
>;
export type UpdateCategoryDto = Partial<CreateCategoryDto>;

export type CreateBlogDto = Omit<
  Blog,
  'id' | 'createdAt' | 'updatedAt' | 'category' | 'translations'
>;
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