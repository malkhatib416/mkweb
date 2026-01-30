import { requireAuth } from '@/lib/auth-utils';
import { projectServiceServer } from '@/lib/services/project.service.server';
import { getErrorMessage, getErrorStatus } from '@/lib/utils/api-error-handler';
import { Locale } from '@/locales/i18n';
import { Status } from '@/types/entities';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// GET - List all projects
export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') as Status | null;
    const locale = searchParams.get('locale') as Locale | null;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const result = await projectServiceServer.getAll({
      page,
      limit,
      status: status || undefined,
      locale: locale || undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch projects') },
      { status: getErrorStatus(error) },
    );
  }
}

// POST - Create new project
export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const result = await projectServiceServer.create(body);

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create project') },
      { status: getErrorStatus(error) },
    );
  }
}
