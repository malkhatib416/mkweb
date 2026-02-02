import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  getAllLanguages,
  createLanguage,
} from '@/lib/services/language.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await getAllLanguages({ page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch languages') },
      { status: getErrorStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const result = await createLanguage(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating language:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create language') },
      { status: getErrorStatus(error) },
    );
  }
}
