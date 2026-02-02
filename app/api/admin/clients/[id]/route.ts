import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { clientServiceServer } from '@/lib/services/client.service.server';
import { getErrorStatus, getErrorMessage } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await clientServiceServer.getById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching client:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch client') },
      { status: getErrorStatus(error) },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const result = await clientServiceServer.update(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating client:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to update client') },
      { status: getErrorStatus(error) },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    await clientServiceServer.delete(id);
    return NextResponse.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to delete client') },
      { status: getErrorStatus(error) },
    );
  }
}
