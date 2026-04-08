import { NextRequest, NextResponse } from 'next/server';
import {
  getLanguageById,
  updateLanguage,
  deleteLanguage,
} from '@/lib/services/language.service.server';
import { withAuthenticatedAdminRoute } from '../../_helpers';

export const GET = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const result = await getLanguageById(id);
    return NextResponse.json(result);
  },
  'Failed to fetch language',
);

export const PUT = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    const body = await request.json();
    const result = await updateLanguage(id, body);
    return NextResponse.json(result);
  },
  'Failed to update language',
);

export const DELETE = withAuthenticatedAdminRoute(
  async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
  ) => {
    const { id } = await params;
    await deleteLanguage(id);
    return NextResponse.json({ message: 'Language deleted successfully' });
  },
  'Failed to delete language',
);
