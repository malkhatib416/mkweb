/**
 * Project review service - create review links, get by token, submit review
 */

import { db } from '@/db';
import { projectReview } from '@/db/schema';
import { eq, and, count, isNull, isNotNull } from 'drizzle-orm';
import { randomBytes } from 'crypto';
import type { ProjectReview, ProjectReviewResponse } from '@/types/entities';

const TOKEN_BYTES = 32;
const DEFAULT_EXPIRY_DAYS = 30;

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('hex');
}

export async function createReviewLink(
  data: { projectId: string; clientId: string },
  expiryDays: number = DEFAULT_EXPIRY_DAYS,
): Promise<ProjectReviewResponse> {
  const { projectId, clientId } = data;
  const token = generateToken();
  const tokenExpiresAt = new Date();
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + expiryDays);

  const existing = await db.query.projectReview.findFirst({
    where: (r, { eq: e, and: a }) =>
      a(e(r.projectId, projectId), e(r.clientId, clientId)),
  });

  if (existing) {
    const [updated] = await db
      .update(projectReview)
      .set({
        token,
        tokenExpiresAt,
        submittedAt: null,
        reviewText: null,
        rating: null,
        updatedAt: new Date(),
      })
      .where(eq(projectReview.id, existing.id))
      .returning();
    return { data: updated as ProjectReview };
  }

  const [created] = await db
    .insert(projectReview)
    .values({
      projectId,
      clientId,
      token,
      tokenExpiresAt,
    })
    .returning();

  return { data: created as ProjectReview };
}

export async function getReviewByToken(token: string): Promise<{
  review: ProjectReview;
  project: { title: string; slug: string };
  client: { name: string };
} | null> {
  const row = await db.query.projectReview.findFirst({
    where: (r, { eq: e }) => e(r.token, token),
    with: {
      project: { columns: { title: true, slug: true } },
      client: { columns: { name: true } },
    },
  });

  if (!row || new Date(row.tokenExpiresAt) < new Date()) {
    return null;
  }

  return {
    review: row as unknown as ProjectReview,
    project: { title: row.project.title, slug: row.project.slug },
    client: { name: row.client.name },
  };
}

export async function submitReview(
  token: string,
  data: { rating: string; reviewText?: string },
): Promise<ProjectReviewResponse> {
  const existing = await db.query.projectReview.findFirst({
    where: (r, { eq: e }) => e(r.token, token),
  });

  if (!existing) throw new Error('Review link not found');
  if (new Date(existing.tokenExpiresAt) < new Date())
    throw new Error('Review link expired');
  if (existing.submittedAt) throw new Error('Review already submitted');

  const [updated] = await db
    .update(projectReview)
    .set({
      rating: data.rating as '1' | '2' | '3' | '4' | '5',
      reviewText: data.reviewText || null,
      submittedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(projectReview.id, existing.id))
    .returning();

  return { data: updated as ProjectReview };
}

export async function getPendingReviewCount(): Promise<number> {
  const [r] = await db
    .select({ count: count() })
    .from(projectReview)
    .where(isNull(projectReview.submittedAt));
  return r?.count ?? 0;
}

export async function getSubmittedReviewsForProject(projectId: string) {
  const rows = await db.query.projectReview.findMany({
    where: (r, { eq: e, and: a, isNotNull: inn }) =>
      a(e(r.projectId, projectId), inn(r.submittedAt)),
    orderBy: (r, { desc: d }) => [d(r.submittedAt!)],
    with: { client: { columns: { name: true, photo: true } } },
    columns: { reviewText: true, rating: true, submittedAt: true },
  });
  return rows.map((r) => ({
    reviewText: r.reviewText,
    rating: r.rating,
    submittedAt: r.submittedAt,
    clientName: r.client.name,
    clientPhoto: r.client.photo,
  }));
}

export async function getSubmittedReviews(limit: number = 10) {
  const rows = await db.query.projectReview.findMany({
    where: (r, { isNotNull: inn }) => inn(r.submittedAt),
    orderBy: (r, { desc: d }) => [d(r.submittedAt!)],
    limit,
    with: {
      client: { columns: { name: true, photo: true } },
      project: { columns: { title: true } },
    },
    columns: { reviewText: true, rating: true, submittedAt: true },
  });
  return rows.map((r) => ({
    reviewText: r.reviewText,
    rating: r.rating,
    submittedAt: r.submittedAt,
    clientName: r.client.name,
    clientPhoto: r.client.photo,
    projectTitle: r.project.title,
  }));
}

export type ReviewListStatus = 'all' | 'pending' | 'submitted';

export async function getAllForAdmin(params: {
  page?: number;
  limit?: number;
  status?: ReviewListStatus;
}) {
  const { page = 1, limit = 10, status = 'all' } = params;
  const offset = (page - 1) * limit;

  const baseConditions = [];
  if (status === 'pending')
    baseConditions.push(isNull(projectReview.submittedAt));
  if (status === 'submitted')
    baseConditions.push(isNotNull(projectReview.submittedAt));
  const whereClause =
    baseConditions.length > 0 ? and(...baseConditions) : undefined;

  const rows = await db.query.projectReview.findMany({
    where: whereClause,
    orderBy: (r, { desc: d }) => [d(r.createdAt)],
    limit,
    offset,
    with: {
      project: { columns: { title: true } },
      client: { columns: { name: true } },
    },
  });

  const [totalRow] = await db
    .select({ count: count() })
    .from(projectReview)
    .where(whereClause);
  const total = totalRow?.count ?? 0;

  const data = rows.map((r) => ({
    id: r.id,
    projectId: r.projectId,
    clientId: r.clientId,
    token: r.token,
    tokenExpiresAt: r.tokenExpiresAt,
    reviewText: r.reviewText,
    rating: r.rating,
    submittedAt: r.submittedAt,
    createdAt: r.createdAt,
    projectTitle: r.project.title,
    clientName: r.client.name,
  }));

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}
