import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-utils';
import { getAllSubscribers } from '@/lib/services/newsletter.service.server';
import { getErrorStatus, getErrorMessage } from '@/lib/utils/api-error-handler';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('limit') || '10')),
    );

    const result = await getAllSubscribers({ page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Failed to fetch subscribers') },
      { status: getErrorStatus(error) },
    );
  }
}
