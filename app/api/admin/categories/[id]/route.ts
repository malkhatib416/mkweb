import {
  deleteCategory,
  getCategoryById,
  updateCategory,
} from '@/lib/services/category.service.server';
import { NextRequest, NextResponse } from 'next/server';
import { getOptionalLocale, withAuthenticatedAdminRoute } from '../../_helpers';

export const GET = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const result = await getCategoryById(id, getOptionalLocale(request));
    return NextResponse.json(result);
  },
  'Failed to fetch category',
);

export const PUT = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();
    const result = await updateCategory(id, body);
    return NextResponse.json(result);
  },
  'Failed to update category',
);

export const DELETE = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    await deleteCategory(id);
    return NextResponse.json({ message: 'Category deleted successfully' });
  },
  'Failed to delete category',
);
