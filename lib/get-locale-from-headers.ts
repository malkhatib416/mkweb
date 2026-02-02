import { headers } from 'next/headers';
import { defaultLocale, isValidLocale, type Locale } from '@/locales/i18n';

/**
 * Get locale from proxy-set header (when using rewrite-based locale, no [locale] segment).
 * Use in server components/layouts only. Do not import this in client components.
 */
export async function getLocaleFromHeaders(): Promise<Locale> {
  const headersList = await headers();
  const locale = headersList.get('x-next-locale');
  return locale && isValidLocale(locale) ? locale : defaultLocale;
}
