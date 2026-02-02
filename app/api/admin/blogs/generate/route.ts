import { requireAuth } from '@/lib/auth-utils';
import {
  generateBlogArticle,
  type GenerateBlogArticleInput,
} from '@/lib/services/ai.service.server';
import { generateAndUploadBlogCoverImage } from '@/lib/services/blog-image.service.server';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getAllLanguages } from '@/lib/services/language.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { estimateReadingTime, generateSlug } from '@/utils/utils';
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
    const categoryId =
      typeof body.categoryId === 'string' && body.categoryId.trim()
        ? body.categoryId.trim()
        : null;

    const { data: languages } = await getAllLanguages({ limit: 100 });
    const supportedLocales = ['fr', 'en'] as const;
    const languagesToUse = languages.filter((l) =>
      supportedLocales.includes(l.code as (typeof supportedLocales)[number]),
    );
    if (languagesToUse.length === 0) {
      return NextResponse.json(
        { error: 'No supported languages (fr, en) configured. Run db:seed.' },
        { status: 400 },
      );
    }

    const created: { id: string; locale: string; title: string }[] = [];

    // Generate first article to get title/description, then generate one shared image
    const firstInput: GenerateBlogArticleInput = {
      topic,
      languageCode: languagesToUse[0].code,
      languageName: languagesToUse[0].name,
    };
    const firstArticle = await generateBlogArticle(firstInput);
    const sharedImageUrl = await generateAndUploadBlogCoverImage(
      firstArticle.title,
      firstArticle.description,
    );

    for (let i = 0; i < languagesToUse.length; i++) {
      const lang = languagesToUse[i];
      const article =
        i === 0
          ? firstArticle
          : await generateBlogArticle({
              topic,
              languageCode: lang.code,
              languageName: lang.name,
            });

      const finalSlug =
        generateSlug(article.slug) || `article-${lang.code}-${Date.now()}`;
      const readingTime = estimateReadingTime(article.content);

      const result = await blogServiceServer.create({
        title: article.title,
        slug: finalSlug,
        locale: lang.code as (typeof supportedLocales)[number],
        description: article.description,
        content: article.content,
        status: 'draft',
        ...(sharedImageUrl && { image: sharedImageUrl }),
        ...(categoryId && { categoryId }),
        readingTime,
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
