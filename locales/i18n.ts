export const locales = ['fr', 'en'] as const;
export const defaultLocale = 'fr' as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(locale?: string): locale is Locale {
  if (!locale) return false;
  return locale === 'fr' || locale === 'en';
}
