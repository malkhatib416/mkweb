import { NextRequest, NextResponse } from 'next/server';
import { getReviewByToken } from '@/lib/services/project-review.service.server';
import { getErrorMessage } from '@/lib/utils/api-error-handler';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: 'Token required' }, { status: 400 });
    }
    const result = await getReviewByToken(token);
    if (!result) {
      return NextResponse.json(
        { error: 'Link not found or expired' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      project: result.project,
      client: result.client,
      submitted: !!result.review.submittedAt,
    });
  } catch (error) {
    console.error('Error fetching review by token:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to load review') },
      { status: 500 },
    );
  }
}
