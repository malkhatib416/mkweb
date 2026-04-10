import { generateBlogArticle } from "@/lib/services/ai.service.server";
import type { Locale } from "@/locales/i18n";
import { generateAndUploadBlogCoverImage } from "@/lib/services/blog-image.service.server";
import { blogServiceServer } from "@/lib/services/blog.service.server";
import { getAllLanguages } from "@/lib/services/language.service.server";
import { localeEnum } from "@/lib/validations/entities";
import { estimateReadingTime, generateSlug } from "@/utils/utils";
import { z } from "zod";

const generateDraftBlogSchema = z.object({
  topic: z.string().trim().min(1, "topic is required"),
  categoryId: z.string().trim().min(1).optional().nullable(),
});

type GeneratedLocalizedArticle = {
  locale: Locale;
  title: string;
  slug: string;
  description: string;
  content: string;
};

function normalizeGeneratedSlug(rawSlug: string, locale: string) {
  return (
    generateSlug(rawSlug) || generateSlug(`article-${locale}-${Date.now()}`)
  );
}

async function getSupportedLanguages() {
  const { data: languages } = await getAllLanguages({ limit: 100 });

  if (languages.length === 0) {
    throw new Error(
      "No languages configured. Seed or create at least one language first."
    );
  }

  return languages;
}

async function generateLocalizedArticles(topic: string) {
  const languages = await getSupportedLanguages();
  const generatedArticles: GeneratedLocalizedArticle[] = [];

  for (const language of languages) {
    const locale = localeEnum.parse(language.code);
    const article = await generateBlogArticle({
      topic,
      languageCode: locale,
      languageName: language.name,
    });

    generatedArticles.push({
      locale,
      title: article.title,
      slug: normalizeGeneratedSlug(article.slug, locale),
      description: article.description,
      content: article.content,
    });
  }

  return generatedArticles;
}

export async function generateDraftBlogTranslations(payload: unknown) {
  const { topic, categoryId } = generateDraftBlogSchema.parse(payload);
  const generatedArticles = await generateLocalizedArticles(topic);
  const [firstArticle, ...otherArticles] = generatedArticles;

  if (!firstArticle) {
    throw new Error(
      "No languages configured. Seed or create at least one language first."
    );
  }

  const sharedImageUrl = await generateAndUploadBlogCoverImage(
    firstArticle.title,
    firstArticle.description
  );

  const sharedReadingTime = Math.max(
    ...generatedArticles.map((article) => estimateReadingTime(article.content))
  );

  const createdBlog = await blogServiceServer.create({
    title: firstArticle.title,
    slug: firstArticle.slug,
    locale: firstArticle.locale,
    description: firstArticle.description,
    content: firstArticle.content,
    status: "draft",
    image: sharedImageUrl ?? null,
    categoryId: categoryId ?? null,
    readingTime: sharedReadingTime,
  });

  const created = [
    {
      id: createdBlog.data.id,
      locale: firstArticle.locale,
      title: firstArticle.title,
    },
  ];

  for (const article of otherArticles) {
    await blogServiceServer.update(createdBlog.data.id, {
      locale: article.locale,
      title: article.title,
      slug: article.slug,
      description: article.description,
      content: article.content,
    });

    created.push({
      id: createdBlog.data.id,
      locale: article.locale,
      title: article.title,
    });
  }

  return {
    success: true,
    data: { created },
    message: `Created 1 shared draft article with ${created.length} translation(s).`,
  };
}
