import DashboardContent from '@/components/admin/DashboardContent';
import { db } from '@/db';
import { blog, client, project } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth-utils';
import { getPendingReviewCount } from '@/lib/services/project-review.service.server';
import { count, desc, eq } from 'drizzle-orm';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [
    blogCountResult,
    projectCountResult,
    publishedBlogCountResult,
    publishedProjectCountResult,
    draftBlogCountResult,
    draftProjectCountResult,
    pendingReviewCount,
    recentClients,
  ] = await Promise.all([
    db.select({ count: count() }).from(blog),
    db.select({ count: count() }).from(project),
    db
      .select({ count: count() })
      .from(blog)
      .where(eq(blog.status, 'published')),
    db
      .select({ count: count() })
      .from(project)
      .where(eq(project.status, 'published')),
    db.select({ count: count() }).from(blog).where(eq(blog.status, 'draft')),
    db
      .select({ count: count() })
      .from(project)
      .where(eq(project.status, 'draft')),
    getPendingReviewCount(),
    db
      .select({ id: client.id, name: client.name, createdAt: client.createdAt })
      .from(client)
      .orderBy(desc(client.createdAt))
      .limit(5),
  ]);

  return (
    <DashboardContent
      user={user}
      blogCount={blogCountResult[0].count}
      projectCount={projectCountResult[0].count}
      publishedBlogCount={publishedBlogCountResult[0].count}
      publishedProjectCount={publishedProjectCountResult[0].count}
      draftBlogCount={draftBlogCountResult[0].count}
      draftProjectCount={draftProjectCountResult[0].count}
      pendingReviewCount={pendingReviewCount}
      recentClients={recentClients}
    />
  );
}
