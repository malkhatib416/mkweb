import { NextRequest, NextResponse } from 'next/server';
import { clientServiceServer } from '@/lib/services/client.service.server';
import { parsePaginationQuery, withAuthenticatedAdminRoute } from '../_helpers';

export const GET = withAuthenticatedAdminRoute(async (request: NextRequest) => {
  const result = await clientServiceServer.getAll(
    parsePaginationQuery(request),
  );
  return NextResponse.json(result);
}, 'Failed to fetch clients');

export const POST = withAuthenticatedAdminRoute(
  async (request: NextRequest) => {
    const body = await request.json();
    const result = await clientServiceServer.create(body);
    return NextResponse.json(result, { status: 201 });
  },
  'Failed to create client',
);
