import { generateAndUploadBlogCoverImage } from '@/lib/services/blog-image.service.server';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthenticatedBlogRoute } from '../_helpers';

function getImageGenerationFailureReason() {
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY?.trim());
  const hasMinIO =
    Boolean(process.env.MINIO_ENDPOINT?.trim()) &&
    Boolean(process.env.MINIO_ACCESS_KEY?.trim()) &&
    Boolean(process.env.MINIO_SECRET_KEY?.trim());

  if (!hasOpenAI) {
    return 'OPENAI_API_KEY is not set or is empty.';
  }

  if (!hasMinIO) {
    return 'MinIO storage (MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY) is not configured.';
  }

  return 'Image generation or upload failed. Try a different title/description. Check server logs for details.';
}

export const POST = withAuthenticatedBlogRoute(async (request: NextRequest) => {
  const body = await request.json();
  const title = typeof body.title === 'string' ? body.title : '';
  const description =
    typeof body.description === 'string' ? body.description : '';

  const url = await generateAndUploadBlogCoverImage(title, description);

  if (!url) {
    return NextResponse.json(
      {
        error: `Image generation failed. ${getImageGenerationFailureReason()}`,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ url });
}, 'Failed to generate image');
