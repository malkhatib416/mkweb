import { NextRequest, NextResponse } from 'next/server';
import { projectServiceServer } from '@/lib/services/project.service.server';
import { withAuthenticatedAdminRoute } from '../../_helpers';

// GET - Get single project
export const GET = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const result = await projectServiceServer.getById(id);
    return NextResponse.json(result);
  },
  'Failed to fetch project',
);

// PUT - Update project
export const PUT = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();
    const result = await projectServiceServer.update(id, body);

    return NextResponse.json(result);
  },
  'Failed to update project',
);

// DELETE - Delete project
export const DELETE = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    await projectServiceServer.delete(id);
    return NextResponse.json({ message: 'Project deleted successfully' });
  },
  'Failed to delete project',
);
