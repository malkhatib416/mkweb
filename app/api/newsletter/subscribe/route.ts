import { NextRequest, NextResponse } from 'next/server';
import { subscribe } from '@/lib/services/newsletter.service.server';
import { getErrorMessage } from '@/lib/utils/api-error-handler';
import { z } from 'zod';

const bodySchema = z.object({
  email: z.string().email(),
  locale: z.enum(['fr', 'en']).optional().default('fr'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = bodySchema.parse(body);
    const result = await subscribe(parsed.email, parsed.locale);
    if (result.subscribed === false) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email or locale', details: error.errors },
        { status: 400 },
      );
    }
    console.error('Newsletter subscribe error:', error);
    return NextResponse.json(
      { error: getErrorMessage(error, 'Subscription failed') },
      { status: 500 },
    );
  }
}
