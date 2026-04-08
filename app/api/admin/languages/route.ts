import { NextRequest, NextResponse } from 'next/server';
import {
  getAllLanguages,
  createLanguage,
} from '@/lib/services/language.service.server';
import { parsePaginationQuery, withAuthenticatedAdminRoute } from '../_helpers';

export const GET = withAuthenticatedAdminRoute(async (request: NextRequest) => {
  const result = await getAllLanguages(parsePaginationQuery(request));
  return NextResponse.json(result);
}, 'Failed to fetch languages');

export const POST = withAuthenticatedAdminRoute(
  async (request: NextRequest) => {
    const body = await request.json();
    const result = await createLanguage(body);
    return NextResponse.json(result, { status: 201 });
  },
  'Failed to create language',
);
