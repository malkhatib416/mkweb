import type { BlogListParams } from '@/types/entities';
import { NextRequest } from 'next/server';
import {
  getOptionalLocale,
  parseStatusLocalePaginationQuery,
  withAuthenticatedAdminRoute,
} from '../_helpers';

export function parseBlogListQuery(request: NextRequest): BlogListParams {
  const searchParams = request.nextUrl.searchParams;
  const query = parseStatusLocalePaginationQuery(request);

  return {
    page: query.page,
    limit: query.limit,
    status: query.status,
    locale: query.locale,
    categoryId: searchParams.get('categoryId') || undefined,
  };
}

export const withAuthenticatedBlogRoute = withAuthenticatedAdminRoute;
export { getOptionalLocale };
