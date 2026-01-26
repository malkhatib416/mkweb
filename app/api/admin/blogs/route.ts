import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getErrorStatus, getErrorMessage } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

// GET - List all blogs
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as 'draft' | 'published' | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await blogServiceServer.getAll({
      page,
      limit,
      status: status || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch blogs') },
      { status: getErrorStatus(error) },
    );
  }
}

// POST - Create new blog
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const result = await blogServiceServer.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create blog') },
      { status: getErrorStatus(error) },
    );
  }
}
