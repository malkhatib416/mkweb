import { projectServiceServer } from '@/lib/services/project.service.server';
import { NextRequest, NextResponse } from 'next/server';
import {
  parseStatusLocalePaginationQuery,
  withAuthenticatedAdminRoute,
} from '../_helpers';

// GET - List all projects
export const GET = withAuthenticatedAdminRoute(async (request: NextRequest) => {
  const result = await projectServiceServer.getAll(
    parseStatusLocalePaginationQuery(request),
  );

  return NextResponse.json(result);
}, 'Failed to fetch projects');

// POST - Create new project
export const POST = withAuthenticatedAdminRoute(
  async (request: NextRequest) => {
    const body = await request.json();
    const result = await projectServiceServer.create(body);

    return NextResponse.json(result, { status: 201 });
  },
  'Failed to create project',
);
