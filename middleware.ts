import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale, isValidLocale } from '@/locales/i18n';

const PUBLIC_FILE = /\.(.*)$/;

function getLocale(request: NextRequest): string {
  // Check if locale is in the cookie
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  if (localeCookie && isValidLocale(localeCookie)) {
    return localeCookie;
  }

  // Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const browserLocale = acceptLanguage.split(',')[0].split('-')[0];
    if (isValidLocale(browserLocale)) {
      return browserLocale;
    }
  }

  return defaultLocale;
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    return;
  }

  // Redirect to locale-prefixed path
  const locale = getLocale(req);
  const newUrl = new URL(`/${locale}${pathname}${req.nextUrl.search}`, req.url);

  return NextResponse.redirect(newUrl);
}
