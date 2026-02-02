/**
 * AI service - Server-side only
 * Wraps the AI SDK for structured generation (e.g. blog articles).
 * Requires OPENAI_API_KEY.
 */

import { openai } from '@ai-sdk/openai';
import { generateObject } from 'ai';
import { z } from 'zod';

const DEFAULT_MODEL_ID = 'gpt-4o-mini';

function getModel() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim()) {
    throw new Error('OPENAI_API_KEY is not configured');
  }
  return openai(DEFAULT_MODEL_ID);
}

export type GenerateObjectOptions<Schema extends z.ZodType> = {
  schema: Schema;
  system: string;
  prompt: string;
  modelId?: string;
};

/**
 * Generate a structured object from the AI model using the given schema.
 * Reusable for any feature that needs structured output (blog, meta, etc.).
 */
export async function generateObjectFromAI<Schema extends z.ZodType>(
  options: GenerateObjectOptions<Schema>,
): Promise<z.infer<Schema>> {
  const { schema, system, prompt, modelId } = options;
  const model = modelId ? openai(modelId) : getModel();
  const { object } = await generateObject({
    model,
    schema,
    system,
    prompt,
  });
  return object as z.infer<Schema>;
}

/** Generated blog article fields (raw from AI; slug should be normalized by caller). */
export type GeneratedArticle = {
  title: string;
  slug: string;
  description: string;
  content: string;
  /** Cover image URL when generated (e.g. Unsplash) and uploaded to storage. */
  image?: string;
};

const articleSchemaZod = z.object({
  title: z.string().describe('Article title in the target language'),
  slug: z
    .string()
    .describe('URL slug: lowercase, hyphens only, e.g. my-article-title'),
  description: z.string().describe('Short meta description (1-2 sentences)'),
  content: z
    .string()
    .describe(
      'Full article body in Markdown format, with headings and paragraphs',
    ),
});

export type GenerateBlogArticleInput = {
  topic: string;
  languageCode: string;
  languageName: string;
};

function getCurrentYear() {
  return new Date().getFullYear();
}

function getSEOAndClientSystem() {
  const year = getCurrentYear();
  return `You are an expert blog writer for MK-Web, a freelance web developer. Write in the same style as the site's reference articles: personal, direct, and practical.

1. VOICE: First-person ("je" / "I") when speaking as the freelancer. Address the reader directly ("tu" / "you" in FR; "you" in EN). Warm but professional, like explaining to a client or colleague.

2. STRUCTURE (match this style):
   - Opening: one short hook paragraph (problem or context), then one sentence stating what the article will cover (e.g. "Dans cet article, je t'explique pourquoi..." / "In this article, I'll explain why...").
   - Body: use ### for each section. Each section title must start with an emoji (e.g. 🚀, 🧩, 🔧, 🧪, 🎯) followed by a short title. Use bullet lists with **bold** lead and a brief line (e.g. "- **App Router** : architecture modulaire ultra claire"). Add 1–2 short paragraphs between sections when needed.
   - When relevant: include a "Cas concret" / "Concrete case" section (### 🧪 ...) with a real or plausible example and a one-line result.
   - Before the CTA: one short personal closing sentence (e.g. "Mon objectif en tant que freelance, ce n'est pas juste d'écrire du code. C'est de livrer des solutions techniques fiables, performantes, maintenables et bien conçues.").
   - End with a CTA in the same style as the reference: a ### heading with 📬 and a short invitation (e.g. "Un projet web en tête ?" / "A web project in mind?"), one sentence offering to help and inviting contact, then three lines each starting with 👉 and a markdown link. Use these links: for FR use https://www.mk-web.fr/fr#services for services, for EN use https://www.mk-web.fr/en#services; contact mailto:contact@mk-web.fr; call booking https://calendly.com/mk-web28/30min. Adapt the link labels to the article language (e.g. "Découvre mes services" / "Discover my services", "Contacte-moi" / "Contact me", "Réserve un appel de 30 minutes" / "Schedule a 30-minute call").

3. SEO: Clear headings, meta-friendly description (150–160 chars), slug lowercase with hyphens. Weave in relevant keywords naturally (referencement, site web, refonte, SEO, etc. for FR).

4. CONTENT: Concrete and actionable. Prefer "how to" and "why". Avoid generic fluff. Use **bold** for emphasis on key terms in lists.

5. CURRENT YEAR: Use ${year} when referring to the present or future. Do not use ${year - 1} or ${year - 2} as the current year.`;
}

/**
 * Generate a single blog article (title, slug, description, content) for the given topic and language.
 * Slug should be normalized with generateSlug() by the caller before persisting.
 */
export async function generateBlogArticle(
  input: GenerateBlogArticleInput,
): Promise<GeneratedArticle> {
  const { topic, languageCode, languageName } = input;
  const year = getCurrentYear();
  const object = await generateObjectFromAI({
    schema: articleSchemaZod,
    system: `${getSEOAndClientSystem()}

Generate the article in ${languageName} (code: ${languageCode}). Output valid Markdown. Slug: lowercase, hyphens only, no spaces or special characters.`,
    prompt: `Write a blog article about: ${topic}. 
Language: ${languageName} (code: ${languageCode}). 
Use the structure and style described in the system prompt: opening hook + "In this article I'll explain...", then sections with ### and emoji (🚀 🧩 🔧 etc.), bullet lists with **bold** leads, optional "Cas concret"/"Concrete case" section, one short personal closing line, then a CTA in the same style (### 📬 heading, one sentence, three 👉 links: services, contact, calendly—use the URLs given in the system prompt).
Current year: ${year}. Make it useful for business owners and attractive to search engines.
Provide title, slug, description (meta, 150–160 chars), and full content in Markdown including the CTA at the end.`,
  });
  return object as GeneratedArticle;
}

/** Input for AI topic suggestions */
export type SuggestArticleTopicsInput = {
  serviceTitles: string[];
  recentArticleTitles: string[];
  count?: number;
  locale?: string;
  /** Category names to align suggestions with (e.g. SEO, Refonte). When provided, AI prefers topics for these categories. */
  categoryNames?: string[];
};

const suggestTopicsSchemaZod = z.object({
  topics: z
    .array(z.string())
    .describe('Array of suggested blog topic titles or short phrases'),
});

/**
 * Suggests blog article topics based on services offered and recent articles.
 * Aims for SEO and client attraction, avoiding duplication with recent content.
 */
export async function suggestArticleTopics(
  input: SuggestArticleTopicsInput,
): Promise<{ topics: string[] }> {
  const {
    serviceTitles,
    recentArticleTitles,
    count = 8,
    locale = 'fr',
    categoryNames = [],
  } = input;
  const year = getCurrentYear();
  const langNote =
    locale === 'en'
      ? 'Suggest topics in English.'
      : 'Suggest topics in French (primary audience: France, Chartres region).';
  const categoryLine =
    categoryNames.length > 0
      ? `3b. ALIGN WITH CATEGORIES: Prefer topics that fit these blog categories: ${categoryNames.join(', ')}.`
      : '';
  const object = await generateObjectFromAI({
    schema: suggestTopicsSchemaZod,
    system: `You are a content strategist for a freelance web developer (MK-Web). Suggest blog article topics that:
1. ATTRACT CLIENTS: Address small business pain points (visibility, no leads, old site, need for e-commerce, SEO, performance). Topics should be practical and lead naturally to the freelancer's services.
2. SEO: Focus on intent-rich topics (how-to, guides, mistakes to avoid, checklists) with clear keyword potential (création site, refonte, SEO, référencement, site qui convertit, etc. for FR).
3. ALIGN WITH SERVICES: Prefer topics that relate to these services: ${serviceTitles.join(', ')}. Do not repeat or closely mimic existing articles.
${categoryLine}
4. AVOID DUPLICATION: Do not suggest topics already covered. Recent article titles: ${recentArticleTitles.length ? recentArticleTitles.slice(0, 20).join(' | ') : '(none)'}.
5. YEAR: The current year is ${year}. Include the year in a topic only when it adds value (e.g. trends, predictions, "guide ${year}", "pour ${year}"). Most topics should NOT mention the year—prefer evergreen titles like "5 erreurs SEO qui font fuir vos clients" or "Pourquoi refaire son site web". Do not use ${year - 1} or ${year - 2} as the current year.
${langNote}
Return only the "topics" array with short, clear topic phrases. Mix evergreen topics (no year) with a few year-specific ones when relevant.`,
    prompt: `Suggest exactly ${count} new blog topic ideas. Current year: ${year}. Services: ${serviceTitles.join(', ')}.${categoryNames.length > 0 ? ` Categories to focus on: ${categoryNames.join(', ')}.` : ''} Recent articles to avoid: ${recentArticleTitles.join(' | ') || 'none'}. Only some topics should mention ${year} (e.g. trends or annual guides); most should be evergreen without a year.`,
  });
  const result = object as { topics: string[] };
  return {
    topics: Array.isArray(result?.topics) ? result.topics.slice(0, count) : [],
  };
}
