import { requireAuth } from '@/lib/auth-utils';
import { generateAndUploadBlogCoverImage } from '@/lib/services/blog-image.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const title = typeof body.title === 'string' ? body.title : '';
    const description =
      typeof body.description === 'string' ? body.description : '';

    const url = await generateAndUploadBlogCoverImage(title, description);

    if (!url) {
      const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
      const hasSupabase = Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
        process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
      );
      const reason = !hasOpenAI
        ? 'OPENAI_API_KEY is not set or is empty.'
        : !hasSupabase
          ? 'Supabase (NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY) is not configured.'
          : 'Image generation or upload failed. Try a different title/description.';
      return NextResponse.json(
        {
          error: `Image generation failed. ${reason}`,
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ url });
  } catch (error) {
    console.error('Generate blog image error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to generate image') },
      { status: getErrorStatus(error) },
    );
  }
}
