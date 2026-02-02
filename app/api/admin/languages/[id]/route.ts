import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  getLanguageById,
  updateLanguage,
  deleteLanguage,
} from '@/lib/services/language.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAuth();
    const { id } = await params;
    const result = await getLanguageById(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching language:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch language') },
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
    const result = await updateLanguage(id, body);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error updating language:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to update language') },
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
    await deleteLanguage(id);
    return NextResponse.json({ message: 'Language deleted successfully' });
  } catch (error) {
    console.error('Error deleting language:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to delete language') },
      { status: getErrorStatus(error) },
    );
  }
}
