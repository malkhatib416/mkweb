import { getCurrentUser } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { blog, project } from '@/lib/db/schema';
import { count, eq } from 'drizzle-orm';
import { FileText, FolderKanban } from 'lucide-react';
import DashboardStats from '@/components/admin/DashboardStats';

export default async function DashboardPage() {
  const user = await getCurrentUser();

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

  const stats = [
    {
      name: 'totalBlogs',
      value: blogCount.count,
      icon: FileText,
      href: '/admin/blogs',
    },
    {
      name: 'publishedBlogs',
      value: publishedBlogCount.count,
      icon: FileText,
      href: '/admin/blogs?status=published',
    },
    {
      name: 'totalProjects',
      value: projectCount.count,
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      name: 'publishedProjects',
      value: publishedProjectCount.count,
      icon: FolderKanban,
      href: '/admin/projects?status=published',
    },
  ];

  return (
    <DashboardStats
      user={user}
      stats={stats}
      blogCount={blogCount.count}
      projectCount={projectCount.count}
      publishedBlogCount={publishedBlogCount.count}
      publishedProjectCount={publishedProjectCount.count}
    />
  );
}
