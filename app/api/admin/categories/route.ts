import { requireAuth } from '@/lib/auth-utils';
import {
  createCategory,
  getAllCategories,
} from '@/lib/services/category.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '100');

    const result = await getAllCategories({ page, limit });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch categories') },
      { status: getErrorStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const result = await createCategory(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create category') },
      { status: getErrorStatus(error) },
    );
  }
}
