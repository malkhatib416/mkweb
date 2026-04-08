import { NextRequest, NextResponse } from 'next/server';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getOptionalLocale, withAuthenticatedBlogRoute } from '../_helpers';

// GET - Get single blog
export const GET = withAuthenticatedBlogRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const result = await blogServiceServer.getById(
      id,
      getOptionalLocale(request),
    );
    return NextResponse.json(result);
  },
  'Failed to fetch blog',
);

// PUT - Update blog
export const PUT = withAuthenticatedBlogRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();
    const result = await blogServiceServer.update(id, body);

    return NextResponse.json(result);
  },
  'Failed to update blog',
);

// DELETE - Delete blog
export const DELETE = withAuthenticatedBlogRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    await blogServiceServer.delete(id);
    return NextResponse.json({ message: 'Blog deleted successfully' });
  },
  'Failed to delete blog',
);
