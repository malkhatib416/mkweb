/**
 * Locale-aware date formatting using moment.
 * Use these helpers instead of custom toLocaleDateString / formatDate logic.
 */

import moment from 'moment';
import 'moment/locale/de';
import 'moment/locale/fr';
import 'moment/locale/en-gb';
import 'moment/locale/es';
import 'moment/locale/it';
import { defaultLocale, type Locale } from '@/locales/i18n';

const momentLocales: Record<Locale, string> = {
  fr: 'fr',
  en: 'en-gb', // moment has no 'en' file; default is en, we use en-gb for consistency
  de: 'de',
  it: 'it',
  es: 'es',
};

/**
 * Format a date for display (date only) in the given locale.
 * e.g. "26 janvier 2026" (fr) or "26 January 2026" (en)
 */
export function formatDate(
  date: Date | string | number,
  locale: Locale = defaultLocale,
): string {
  const m = moment(date);
  m.locale(momentLocales[locale] ?? locale);
  return m.format('LL');
}

/**
 * Format a date and time for display in the given locale.
 * e.g. "26/01/2026 14:30" (fr) or "26/01/2026 14:30" (en)
 */
export function formatDateTime(
  date: Date | string | number,
  locale: Locale = defaultLocale,
): string {
  const m = moment(date);
  m.locale(momentLocales[locale] ?? locale);
  return m.format('L LTS');
}

/**
 * Format a date for relative display (e.g. "il y a 2 heures", "2 hours ago").
 */
export function formatRelative(
  date: Date | string | number,
  locale: Locale = defaultLocale,
  base?: Date | string | number,
): string {
  const m = moment(date);
  m.locale(momentLocales[locale] ?? locale);
  return base ? m.from(base) : m.fromNow();
}
