import { blogServiceServer } from '@/lib/services/blog.service.server';
import { defaultLocale, isValidLocale, type Locale } from '@/locales/i18n';
import { NextResponse } from 'next/server';

function swapLocalePrefix(pathname: string, targetLocale: Locale): string {
  const localeMatch = pathname.match(/^\/(fr|en)(\/.*)?$/);
  if (!localeMatch) {
    return `/${targetLocale}${pathname === '/' ? '' : pathname}`;
  }

  const rest = localeMatch[2] ?? '';
  return `/${targetLocale}${rest}` || `/${targetLocale}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pathname = searchParams.get('pathname') ?? '/';
  const targetLocaleParam = searchParams.get('targetLocale') ?? undefined;
  const targetLocale = isValidLocale(targetLocaleParam)
    ? targetLocaleParam
    : defaultLocale;

  const localeMatch = pathname.match(/^\/(fr|en)(\/.*)?$/);
  const localeSegment = localeMatch?.[1];
  const currentLocale = isValidLocale(localeSegment)
    ? localeSegment
    : defaultLocale;

  const normalizedFallbackPath = swapLocalePrefix(pathname, targetLocale);

  const blogMatch = pathname.match(/^\/(fr|en)\/blog\/([^/]+)$/);

  if (!blogMatch) {
    return NextResponse.json({ pathname: normalizedFallbackPath });
  }

  const currentSlug = decodeURIComponent(blogMatch[2]);

  try {
    const { data: blog } = await blogServiceServer.getBySlug(
      currentSlug,
      currentLocale,
    );

    const targetTranslation = blog.translations?.find(
      (translation) => translation.locale === targetLocale,
    );

    if (targetTranslation?.slug) {
      return NextResponse.json({
        pathname: `/${targetLocale}/blog/${targetTranslation.slug}`,
      });
    }

    return NextResponse.json({ pathname: `/${targetLocale}/blog` });
  } catch {
    return NextResponse.json({ pathname: normalizedFallbackPath });
  }
}
