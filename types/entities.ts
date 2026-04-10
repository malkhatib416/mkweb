/**
 * Shared entity types inferred from Drizzle schema
 */

import type { Locale } from '@/locales/i18n';
import {
  blog,
  category,
  client,
  language,
  newsletterSubscriber,
  project,
  projectReview,
  translation,
} from '@/db/schema';
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';

export type * from './api';
export type * from './dto';
export type { Locale } from '@/locales/i18n';

// Inferred from schema (blog and project share these enums)
export type Status = InferSelectModel<typeof blog>['status'];
export type TranslationEntityType = InferSelectModel<
  typeof translation
>['entityType'];

// Entity types inferred from schema
export type Language = InferSelectModel<typeof language>;
export type LanguageInsert = InferInsertModel<typeof language>;
export type Translation = InferSelectModel<typeof translation> & {
  locale: Locale;
};
export type TranslationInsert = InferInsertModel<typeof translation>;
export type CategoryBase = InferSelectModel<typeof category>;
export type BlogBase = InferSelectModel<typeof blog>;
export type CategoryTranslation = Translation & {
  entityType: 'category';
  categoryId: string;
  blogId: null;
  locale: Locale;
  name: string | null;
  slug: string;
};
export type BlogTranslation = Translation & {
  entityType: 'blog';
  blogId: string;
  categoryId: null;
  locale: Locale;
  title: string | null;
  slug: string;
  content: string | null;
};
export type Category = CategoryBase & {
  locale: Locale;
  name: string;
  slug: string;
  description: string | null;
  translations?: CategoryTranslation[];
};
export type CategoryInsert = InferInsertModel<typeof category>;
export type Blog = BlogBase & {
  locale: Locale;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  category?: Category | null;
  translations?: BlogTranslation[];
};
export type BlogInsert = InferInsertModel<typeof blog>;
export type ProjectBase = InferSelectModel<typeof project>;
export type ProjectTranslation = Translation & {
  entityType: 'project';
  projectId: string;
  blogId: null;
  categoryId: null;
  locale: Locale;
  title: string | null;
  slug: string;
  content: string | null;
};
export type Client = InferSelectModel<typeof client>;
export type ClientInsert = InferInsertModel<typeof client>;
export type Project = ProjectBase & {
  locale: Locale;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  translations?: ProjectTranslation[];
};
export type ProjectInsert = InferInsertModel<typeof project>;
export type ProjectReview = InferSelectModel<typeof projectReview>;
export type ProjectReviewInsert = InferInsertModel<typeof projectReview>;
export type NewsletterSubscriber = InferSelectModel<
  typeof newsletterSubscriber
>;
export type NewsletterSubscriberInsert = InferInsertModel<
  typeof newsletterSubscriber
>;
