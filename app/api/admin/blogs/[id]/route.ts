import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getErrorStatus, getErrorMessage } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

// GET - Get single blog
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const result = await blogServiceServer.getById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch blog') },
      { status: getErrorStatus(error) },
    );
  }
}

// PUT - Update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    const body = await request.json();
    const result = await blogServiceServer.update(id, body);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to update blog') },
      { status: getErrorStatus(error) },
    );
  }
}

// DELETE - Delete blog
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;

    await blogServiceServer.delete(id);
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to delete blog') },
      { status: getErrorStatus(error) },
    );
  }
}
