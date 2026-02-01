/**
 * Server-only: generate a blog cover image via OpenAI GPT Image API and upload to Supabase.
 * Uses gpt-image-1.5 for editorial-style covers. Used by the generate-image API route and article generation.
 */

import { CLIENT_PHOTOS_BUCKET, supabaseAdmin } from '@/lib/supabase';

const BLOG_COVERS_PREFIX = 'blog-covers';
const OPENAI_IMAGES_URL = 'https://api.openai.com/v1/images/generations';
const GPT_IMAGE_MODEL = 'gpt-image-1.5';

/** Style presets so each article gets a different look; chosen by hash of title+description. */
const COVER_STYLE_PRESETS = [
  'Minimalist: soft gradients, lots of negative space, one or two subtle shapes, calm and understated.',
  'Editorial: warm tones, soft light, abstract shapes or blurred geometry, magazine-cover feel.',
  'Tech-inspired: cool blues and greys, subtle grid or code-like patterns, clean and modern.',
  'Organic: soft curves, natural textures or flowing shapes, warm neutrals with one accent.',
  'Bold contrast: strong but limited palette (e.g. dark + one bright accent), geometric, high impact.',
  'Soft and airy: light pastels or neutrals, delicate shapes, gentle gradients, elegant and quiet.',
  'Structured: clear lines and composition, architectural feel, muted colours, professional.',
  'Dynamic: sense of movement or depth, layered shapes, rich but not loud colours.',
];

/** Simple numeric hash from string (for deterministic style choice per article). */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Build an image prompt from article title and description with varied style (no text). */
function buildImagePrompt(title: string, description: string): string {
  const topic = [title.trim(), description.trim()].filter(Boolean).join('. ');
  const seed = topic || title || 'blog';
  const styleIndex = hashString(seed) % COVER_STYLE_PRESETS.length;
  const style = COVER_STYLE_PRESETS[styleIndex]!;
  if (!topic)
    return `Professional blog cover, abstract digital and web theme. ${style} No text, no words, no letters. No human faces.`;
  return `Blog cover image for an article about: ${topic}. Visual style: ${style} No text, no words, no letters. No human faces. Abstract or conceptual only. Suitable for a freelance web developer blog.`;
}

type OpenAIImagesResponse = {
  data?: Array<{ b64_json?: string }>;
  error?: { message?: string };
};

/**
 * Generates a cover image with the GPT Image API (gpt-image-1.5), uploads it to Supabase, and returns the public URL.
 * Returns null if OPENAI_API_KEY or Supabase is not configured, or if generation/upload fails.
 */
export async function generateAndUploadBlogCoverImage(
  title: string,
  description: string,
): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey?.trim() || !supabaseAdmin) {
    return null;
  }

  const prompt = buildImagePrompt(title, description);

  const res = await fetch(OPENAI_IMAGES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GPT_IMAGE_MODEL,
      prompt,
      n: 1,
      size: '1536x1024',
      quality: 'medium',
      output_format: 'png',
    }),
  });

  const json = (await res.json()) as OpenAIImagesResponse;
  if (!res.ok) {
    console.error(
      'OpenAI images API error:',
      res.status,
      json?.error?.message ?? json,
    );
    return null;
  }

  const first = json.data?.[0];
  const b64 = first?.b64_json;
  if (!b64) {
    console.error('OpenAI images API: no image in response');
    return null;
  }

  const bytes = Buffer.from(b64, 'base64').buffer;
  const contentType = 'image/png';

  const ext = contentType.includes('png') ? 'png' : 'jpg';
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;
  const path = `${BLOG_COVERS_PREFIX}/${safeName}`;

  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from(CLIENT_PHOTOS_BUCKET)
    .upload(path, bytes, {
      contentType,
      upsert: false,
    });

  if (uploadError) {
    console.error('Supabase upload error:', uploadError);
    return null;
  }

  const { data: urlData } = supabaseAdmin.storage
    .from(CLIENT_PHOTOS_BUCKET)
    .getPublicUrl(uploadData.path);

  return urlData.publicUrl;
}
