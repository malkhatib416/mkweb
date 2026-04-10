import { NextRequest, NextResponse } from 'next/server';
import { refreshBlogTranslationsForLanguages } from '@/lib/services/language.service.server';
import { withAuthenticatedBlogRoute } from '../_helpers';

export const POST = withAuthenticatedBlogRoute(async (request: NextRequest) => {
  void request;
  const result = await refreshBlogTranslationsForLanguages();
  return NextResponse.json({ data: result });
}, 'Failed to refresh blog translations');
