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

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Skip proxy for API routes and admin (no locale prefix)
  if (pathname.startsWith('/api/') || pathname.startsWith('/admin/')) {
    return;
  }

  // Skip middleware for static files and Next.js internals
  if (pathname.startsWith('/_next') || PUBLIC_FILE.test(pathname)) {
    return;
  }

  // Check if pathname starts with a valid locale (e.g. /fr, /fr/blog)
  const localeMatch = pathname.match(/^\/(fr|en)(\/.*)?$/);
  if (localeMatch) {
    const locale = localeMatch[1];
    const rest = localeMatch[2] ?? '';
    // Rewrite /fr/blog -> /blog, /en -> / (URL stays /fr/blog in browser)
    const rewritePath = rest || '/';
    const url = new URL(rewritePath + req.nextUrl.search, req.url);
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-next-locale', locale);
    return NextResponse.rewrite(url, {
      request: { headers: requestHeaders },
    });
  }

  // No locale in path: redirect to locale-prefixed path
  const locale = getLocale(req);
  const newUrl = new URL(
    `/${locale}${pathname === '/' ? '' : pathname}${req.nextUrl.search}`,
    req.url,
  );

  return NextResponse.redirect(newUrl);
}

// Only run proxy for locale-prefixed pages (exclude api, admin, static files)
export const config = {
  matcher: [
    '/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',
  ],
};
