import { requireAuth } from '@/lib/auth-utils';
import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '@/lib/services/category.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await getCategoryById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch category') },
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
    const result = await updateCategory(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to update category') },
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
    await deleteCategory(id);
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to delete category') },
      { status: getErrorStatus(error) },
    );
  }
}
