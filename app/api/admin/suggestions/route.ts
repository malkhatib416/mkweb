import { requireAuth } from '@/lib/auth-utils';
import { suggestArticleTopics } from '@/lib/services/ai.service.server';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getAllCategories } from '@/lib/services/category.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { getDictionary } from '@/locales/dictionaries';
import { defaultLocale } from '@/locales/i18n';
import { NextRequest, NextResponse } from 'next/server';

const SERVICE_KEYS = [
  'website',
  'ecommerce',
  'redesign',
  'maintenance',
  'innovation',
  'mobileapp',
] as const;
const DEFAULT_SUGGESTIONS_COUNT = 8;
const MAX_SUGGESTIONS_COUNT = 15;
const LATEST_ARTICLES_LIMIT = 15;

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const locale = request.nextUrl.searchParams.get('locale') ?? defaultLocale;
    const countParam = request.nextUrl.searchParams.get('count');
    const count = countParam
      ? Math.min(
          MAX_SUGGESTIONS_COUNT,
          Math.max(1, parseInt(countParam, 10) || DEFAULT_SUGGESTIONS_COUNT),
        )
      : DEFAULT_SUGGESTIONS_COUNT;
    const categoryIdsParam = request.nextUrl.searchParams.get('categoryIds');
    const categoryIds =
      categoryIdsParam
        ?.split(',')
        .map((id) => id.trim())
        .filter(Boolean) ?? [];

    const dict = await getDictionary(locale === 'en' ? 'en' : ('fr' as 'fr'));
    const services = SERVICE_KEYS.map((key) => ({
      key,
      title:
        (dict.services as Record<string, { title: string }>)[key]?.title ?? key,
    }));
    const serviceTitles = services.map((s) => s.title);

    const { data: latestBlogs } = await blogServiceServer.getAll({
      page: 1,
      limit: LATEST_ARTICLES_LIMIT,
    });
    const recentArticleTitles = latestBlogs.map((b) => b.title);

    let categoryNames: string[] = [];
    if (categoryIds.length > 0) {
      const { data: allCategories } = await getAllCategories({ limit: 100 });
      const selected = allCategories.filter((c) => categoryIds.includes(c.id));
      categoryNames = selected.map((c) => c.name);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    let suggestions: string[] = [];
    if (apiKey?.trim()) {
      const { topics } = await suggestArticleTopics({
        serviceTitles,
        recentArticleTitles,
        count,
        locale: locale === 'en' ? 'en' : 'fr',
        ...(categoryNames.length > 0 && { categoryNames }),
      });
      suggestions = topics;
    }

    return NextResponse.json({
      data: {
        suggestions,
        latestArticles: latestBlogs,
        services,
      },
    });
  } catch (error) {
    console.error('Suggestions API error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to load suggestions') },
      { status: getErrorStatus(error) },
    );
  }
}
