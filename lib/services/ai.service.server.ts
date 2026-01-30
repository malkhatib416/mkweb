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

/**
 * Generate a single blog article (title, slug, description, content) for the given topic and language.
 * Slug should be normalized with generateSlug() by the caller before persisting.
 */
export async function generateBlogArticle(
  input: GenerateBlogArticleInput,
): Promise<GeneratedArticle> {
  const { topic, languageCode, languageName } = input;
  const object = await generateObjectFromAI({
    schema: articleSchemaZod,
    system: `You are a professional blog writer. Generate a single blog article in the language corresponding to the code "${languageCode}" (${languageName}). 
Output valid Markdown for content. Use headings (##), paragraphs, and lists where appropriate. 
The slug must be lowercase, use hyphens only, no spaces or special characters.`,
    prompt: `Write a blog article about: ${topic}. 
Language: ${languageName} (code: ${languageCode}). 
Provide title, slug, description, and full content in Markdown.`,
  });
  return object as GeneratedArticle;
}
