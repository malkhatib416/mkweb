import {
  createCategory,
  getAllCategories,
} from '@/lib/services/category.service.server';
import { NextRequest, NextResponse } from 'next/server';
import {
  getOptionalLocale,
  parsePaginationQuery,
  withAuthenticatedAdminRoute,
} from '../_helpers';

export const GET = withAuthenticatedAdminRoute(async (request: NextRequest) => {
  const pagination = parsePaginationQuery(request, { limit: 100 });
  const result = await getAllCategories({
    ...pagination,
    locale: getOptionalLocale(request),
  });

  return NextResponse.json(result);
}, 'Failed to fetch categories');

export const POST = withAuthenticatedAdminRoute(
  async (request: NextRequest) => {
    const body = await request.json();
    const result = await createCategory(body);
    return NextResponse.json(result, { status: 201 });
  },
  'Failed to create category',
);
