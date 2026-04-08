import { NextRequest, NextResponse } from 'next/server';
import { clientServiceServer } from '@/lib/services/client.service.server';
import { withAuthenticatedAdminRoute } from '../../_helpers';

export const GET = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const result = await clientServiceServer.getById(id);
    return NextResponse.json(result);
  },
  'Failed to fetch client',
);

export const PUT = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();
    const result = await clientServiceServer.update(id, body);
    return NextResponse.json(result);
  },
  'Failed to update client',
);

export const DELETE = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    await clientServiceServer.delete(id);
    return NextResponse.json({ message: 'Client deleted successfully' });
  },
  'Failed to delete client',
);
