/**
 * Newsletter subscriber service - server-side
 */

import { db } from '@/db';
import { newsletterSubscriber } from '@/db/schema';
import { count } from 'drizzle-orm';
import type {
  NewsletterSubscriber,
  NewsletterSubscriberListResponse,
} from '@/types/entities';

export interface NewsletterListParams {
  page?: number;
  limit?: number;
}

export async function getAllSubscribers(
  params: NewsletterListParams = {},
): Promise<NewsletterSubscriberListResponse> {
  const { page = 1, limit = 50 } = params;
  const offset = (page - 1) * limit;

  const rows = await db.query.newsletterSubscriber.findMany({
    orderBy: (n, { desc: d }) => [d(n.createdAt)],
    limit,
    offset,
  });

  const [totalResult] = await db
    .select({ count: count() })
    .from(newsletterSubscriber);
  const total = totalResult?.count ?? 0;

  return {
    data: rows as NewsletterSubscriber[],
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function subscribe(
  email: string,
  locale: 'fr' | 'en' = 'fr',
): Promise<{ subscribed: true } | { subscribed: false; error: string }> {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return { subscribed: false, error: 'Email is required' };

  const existing = await db.query.newsletterSubscriber.findFirst({
    where: (n, { eq: e }) => e(n.email, normalized),
  });

  if (existing) {
    return { subscribed: true }; // idempotent: already subscribed
  }

  await db.insert(newsletterSubscriber).values({
    email: normalized,
    locale,
  });

  return { subscribed: true };
}
