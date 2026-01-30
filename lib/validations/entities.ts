/**
 * Shared validation schemas for entities
 * Reuses common enums for locale and status
 */

import { z } from 'zod';
import type { Status } from '@/types/entities';
import type { Locale } from '@/locales/i18n';
import { locales } from '@/locales/i18n';

// Shared enum validators
export const localeEnum = z.enum(locales) satisfies z.ZodType<Locale>;
export const statusEnum = z.enum([
  'draft',
  'published',
]) satisfies z.ZodType<Status>;

// Common field validators
export const slugValidator = z
  .string()
  .min(1, 'Slug is required')
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format');

export const titleValidator = z.string().min(1, 'Title is required');
export const contentValidator = z.string().min(1, 'Content is required');
