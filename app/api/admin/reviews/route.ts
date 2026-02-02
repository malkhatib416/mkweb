import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import {
  createReviewLink,
  getAllForAdmin,
  type ReviewListStatus,
} from '@/lib/services/project-review.service.server';
import { getErrorStatus, getErrorMessage } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

const createBodySchema = z.object({
  projectId: z.string().min(1),
  clientId: z.string().min(1),
  expiryDays: z.number().int().min(1).max(365).optional(),
});

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('limit') || '10')),
    );
    const status = (searchParams.get('status') || 'all') as ReviewListStatus;

    const result = await getAllForAdmin({ page, limit, status });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch reviews') },
      { status: getErrorStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const body = await request.json();
    const parsed = createBodySchema.parse(body);
    const result = await createReviewLink(
      { projectId: parsed.projectId, clientId: parsed.clientId },
      parsed.expiryDays,
    );
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error('Error creating review link:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to create review link') },
      { status: getErrorStatus(error) },
    );
  }
}
