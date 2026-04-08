import { NextRequest, NextResponse } from 'next/server';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { parseBlogListQuery, withAuthenticatedBlogRoute } from './_helpers';

// GET - List all blogs
export const GET = withAuthenticatedBlogRoute(async (request: NextRequest) => {
  const result = await blogServiceServer.getAll(parseBlogListQuery(request));
  return NextResponse.json(result);
}, 'Failed to fetch blogs');

// POST - Create new blog
export const POST = withAuthenticatedBlogRoute(async (request: NextRequest) => {
  const body = await request.json();
  const result = await blogServiceServer.create(body);

  return NextResponse.json(result, { status: 201 });
}, 'Failed to create blog');
