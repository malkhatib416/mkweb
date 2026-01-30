import { getDictionary } from '@/locales/dictionaries';
import { defaultLocale, isValidLocale } from '@/locales/i18n';
import { NextResponse } from 'next/server';

/**
 * GET /api/admin/dictionary?locale=fr
 * Returns the admin dictionary JSON for the given locale (client-side hook use).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const localeParam = searchParams.get('locale') ?? undefined;
  const locale = isValidLocale(localeParam) ? localeParam : defaultLocale;
  const dict = await getDictionary(locale);
  return NextResponse.json(dict);
}
