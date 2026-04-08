import { generateDraftBlogTranslations } from '@/lib/services/blog-generation.service.server';
import { NextRequest, NextResponse } from 'next/server';
import { withAuthenticatedBlogRoute } from '../_helpers';

export const POST = withAuthenticatedBlogRoute(async (request: NextRequest) => {
  const body = await request.json();
  const result = await generateDraftBlogTranslations(body);

  return NextResponse.json(result);
}, 'Failed to generate articles');
