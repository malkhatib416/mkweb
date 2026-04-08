/**
 * Shared validation schemas for entities
 * DB-backed content locales are dynamic; status remains fixed.
 */

import type { Locale, Status } from '@/types/entities';
import { z } from 'zod';

// Shared validators
export const localeEnum = z
  .string()
  .trim()
  .min(2, 'Locale is required')
  .max(16, 'Locale must be at most 16 characters')
  .regex(/^[a-z]{2,10}(?:-[a-z0-9]{2,10})*$/i, 'Invalid locale format')
  .transform((value) => value.toLowerCase()) satisfies z.ZodType<Locale>;

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
export const readingTimeValidator = z
  .number()
  .int('Reading time must be a whole number')
  .min(1, 'Reading time must be at least 1 minute')
  .max(120, 'Reading time must be at most 120 minutes')
  .optional()
  .nullable();
