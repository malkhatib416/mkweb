'use client';

import { FileText, FolderKanban } from 'lucide-react';
import { useAdminDictionary } from './AdminDictionaryProvider';

interface DashboardStatsProps {
  user: {
    name: string | null;
    email: string;
  } | null;
  stats: Array<{
    name: string;
    value: number;
    icon: typeof FileText;
    href: string;
  }>;
  blogCount: number;
  projectCount: number;
  publishedBlogCount: number;
  publishedProjectCount: number;
}

export default function DashboardStats({
  user,
  blogCount,
  projectCount,
  publishedBlogCount,
  publishedProjectCount,
}: DashboardStatsProps) {
  const dict = useAdminDictionary();
  const t = dict.admin.dashboard;
  const stats = dict.admin.dashboard.stats;

  const statItems = [
    {
      name: stats.totalBlogs,
      value: blogCount,
      icon: FileText,
      href: '/admin/blogs',
    },
    {
      name: stats.publishedBlogs,
      value: publishedBlogCount,
      icon: FileText,
      href: '/admin/blogs?status=published',
    },
    {
      name: stats.totalProjects,
      value: projectCount,
      icon: FolderKanban,
      href: '/admin/projects',
    },
    {
      name: stats.publishedProjects,
      value: publishedProjectCount,
      icon: FolderKanban,
      href: '/admin/projects?status=published',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-foreground">
          {t.title}
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-muted-foreground">
          {t.welcome.replace('{name}', user?.name || user?.email || 'User')}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statItems.map((stat) => (
          <div
            key={stat.name}
            className="relative overflow-hidden rounded-lg bg-white dark:bg-card px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 border border-transparent dark:border-border/50"
          >
            <dt>
              <div className="absolute rounded-md bg-myorange-100 p-3">
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500 dark:text-muted-foreground">
                {stat.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900 dark:text-foreground">
                {stat.value}
              </p>
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}
