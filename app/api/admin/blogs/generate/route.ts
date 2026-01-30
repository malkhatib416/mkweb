import { requireAuth } from '@/lib/auth-utils';
import {
  generateBlogArticle,
  type GenerateBlogArticleInput,
} from '@/lib/services/ai.service.server';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getAllLanguages } from '@/lib/services/language.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { locales, type Locale } from '@/locales/i18n';
import { generateSlug } from '@/utils/utils';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const topic =
      typeof body.topic === 'string' && body.topic.trim()
        ? body.topic.trim()
        : null;
    if (!topic) {
      return NextResponse.json({ error: 'topic is required' }, { status: 400 });
    }

    const { data: languages } = await getAllLanguages({ limit: 100 });
    const languagesToUse = languages.filter((l) =>
      locales.includes(l.code as Locale),
    );
    if (languagesToUse.length === 0) {
      return NextResponse.json(
        { error: 'No supported languages (fr, en) configured. Run db:seed.' },
        { status: 400 },
      );
    }

    const created: { id: string; locale: string; title: string }[] = [];

    for (const lang of languagesToUse) {
      const input: GenerateBlogArticleInput = {
        topic,
        languageCode: lang.code,
        languageName: lang.name,
      };
      const article = await generateBlogArticle(input);

      const finalSlug =
        generateSlug(article.slug) || `article-${lang.code}-${Date.now()}`;

      const result = await blogServiceServer.create({
        title: article.title,
        slug: finalSlug,
        locale: lang.code as Locale,
        description: article.description,
        content: article.content,
        status: 'draft',
      });

      created.push({
        id: result.data.id,
        locale: lang.code,
        title: result.data.title,
      });
    }

    return NextResponse.json({
      success: true,
      data: { created },
      message: `Created ${created.length} draft article(s), one per language.`,
    });
  } catch (error) {
    console.error('Error generating articles:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to generate articles') },
      { status: getErrorStatus(error) },
    );
  }
}
