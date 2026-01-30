import { NextRequest, NextResponse } from 'next/server';
import { submitReview } from '@/lib/services/project-review.service.server';
import { getErrorStatus, getErrorMessage } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

const bodySchema = z.object({
  token: z.string().min(1),
  rating: z.enum(['1', '2', '3', '4', '5']),
  reviewText: z.string().max(2000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.parse(body);
    const result = await submitReview(parsed.token, {
      rating: parsed.rating,
      reviewText: parsed.reviewText,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to submit review') },
      { status: getErrorStatus(error) },
    );
  }
}
