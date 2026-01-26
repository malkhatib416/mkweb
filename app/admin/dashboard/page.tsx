import { getCurrentUser } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { blog, project } from '@/lib/db/schema';
import { count, eq, desc } from 'drizzle-orm';
import DashboardContent from '@/components/admin/DashboardContent';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  // Get counts
  const [blogCount] = await db.select({ count: count() }).from(blog);
  const [projectCount] = await db.select({ count: count() }).from(project);
  const [publishedBlogCount] = await db
    .select({ count: count() })
    .from(blog)
    .where(eq(blog.status, 'published'));
  const [publishedProjectCount] = await db
    .select({ count: count() })
    .from(project)
    .where(eq(project.status, 'published'));
  const [draftBlogCount] = await db
    .select({ count: count() })
    .from(blog)
    .where(eq(blog.status, 'draft'));
  const [draftProjectCount] = await db
    .select({ count: count() })
    .from(project)
    .where(eq(project.status, 'draft'));

  // Get recent items
  const recentBlogs = await db
    .select()
    .from(blog)
    .orderBy(desc(blog.updatedAt))
    .limit(5);

  const recentProjects = await db
    .select()
    .from(project)
    .orderBy(desc(project.updatedAt))
    .limit(5);

  return (
    <DashboardContent
      user={user}
      blogCount={blogCount.count}
      projectCount={projectCount.count}
      publishedBlogCount={publishedBlogCount.count}
      publishedProjectCount={publishedProjectCount.count}
      draftBlogCount={draftBlogCount.count}
      draftProjectCount={draftProjectCount.count}
      recentBlogs={recentBlogs}
      recentProjects={recentProjects}
    />
  );
}
