'use client';

import Link from 'next/link';
import {
  FileText,
  FolderKanban,
  Plus,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminDictionary } from './AdminDictionaryProvider';
import type { Blog, Project } from '@/types/entities';

interface DashboardContentProps {
  user: {
    name: string | null;
    email: string;
  } | null;
  blogCount: number;
  projectCount: number;
  publishedBlogCount: number;
  publishedProjectCount: number;
  draftBlogCount: number;
  draftProjectCount: number;
  recentBlogs: Pick<Blog, 'id' | 'title' | 'locale' | 'status' | 'updatedAt'>[];
  recentProjects: Pick<
    Project,
    'id' | 'title' | 'locale' | 'status' | 'updatedAt'
  >[];
}

export default function DashboardContent({
  user,
  blogCount,
  projectCount,
  publishedBlogCount,
  publishedProjectCount,
  draftBlogCount,
  draftProjectCount,
  recentBlogs,
  recentProjects,
}: DashboardContentProps) {
  const dict = useAdminDictionary();
  const t = dict.admin.dashboard;
  const stats = dict.admin.dashboard.stats;

  const statItems = [
    {
      name: stats.totalBlogs,
      value: blogCount,
      icon: FileText,
      href: '/admin/blogs',
      color: 'bg-blue-500',
    },
    {
      name: stats.publishedBlogs,
      value: publishedBlogCount,
      icon: FileText,
      href: '/admin/blogs?status=published',
      color: 'bg-green-500',
    },
    {
      name: stats.draftBlogs,
      value: draftBlogCount,
      icon: FileText,
      href: '/admin/blogs?status=draft',
      color: 'bg-yellow-500',
    },
    {
      name: stats.totalProjects,
      value: projectCount,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'bg-purple-500',
    },
    {
      name: stats.publishedProjects,
      value: publishedProjectCount,
      icon: FolderKanban,
      href: '/admin/projects?status=published',
      color: 'bg-green-500',
    },
    {
      name: stats.draftProjects,
      value: draftProjectCount,
      icon: FolderKanban,
      href: '/admin/projects?status=draft',
      color: 'bg-yellow-500',
    },
  ];

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t.justNow;
    if (diffMins < 60) return `${diffMins} ${t.minutesAgo}`;
    if (diffHours < 24) return `${diffHours} ${t.hoursAgo}`;
    if (diffDays < 7) return `${diffDays} ${t.daysAgo}`;
    return d.toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-sm text-gray-600">
            {t.welcome.replace('{name}', user?.name || user?.email || 'User')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="gap-2">
              <ExternalLink className="h-4 w-4" />
              {t.viewSite}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/admin/blogs/new">
          <Button className="w-full bg-myorange-100 hover:bg-myorange-200 gap-2">
            <Plus className="h-4 w-4" />
            {dict.admin.blogs.newBlog}
          </Button>
        </Link>
        <Link href="/admin/projects/new">
          <Button className="w-full bg-myorange-100 hover:bg-myorange-200 gap-2">
            <Plus className="h-4 w-4" />
            {dict.admin.projects.newProject}
          </Button>
        </Link>
      </div>

      {/* Statistics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {t.statistics}
        </h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map((stat) => (
            <Link key={stat.name} href={stat.href}>
              <div className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6 hover:shadow-md transition-shadow cursor-pointer">
                <dt>
                  <div className={`absolute rounded-md ${stat.color} p-3`}>
                    <stat.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-500">
                    {stat.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </dd>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Blogs */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t.recentBlogs}
            </h2>
            <Link
              href="/admin/blogs"
              className="text-sm text-myorange-100 hover:text-myorange-200"
            >
              {t.viewAll}
            </Link>
          </div>
          {recentBlogs.length === 0 ? (
            <p className="text-sm text-gray-500">{t.noRecentBlogs}</p>
          ) : (
            <ul className="space-y-3">
              {recentBlogs.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/blogs/${item.id}`}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {dict.admin.blogs.status[item.status]}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {item.locale.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              {t.recentProjects}
            </h2>
            <Link
              href="/admin/projects"
              className="text-sm text-myorange-100 hover:text-myorange-200"
            >
              {t.viewAll}
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-sm text-gray-500">{t.noRecentProjects}</p>
          ) : (
            <ul className="space-y-3">
              {recentProjects.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/admin/projects/${item.id}`}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            item.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {dict.admin.projects.status[item.status]}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {item.locale.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.updatedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
