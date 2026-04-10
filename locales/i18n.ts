export const locales = ['fr', 'en', 'de', 'it', 'es'] as const;
export const defaultLocale = 'fr' as const;

export type Locale = (typeof locales)[number];

export function isValidLocale(locale?: string): locale is Locale {
  if (!locale) return false;
  return (locales as readonly string[]).includes(locale);
}
