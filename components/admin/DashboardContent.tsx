'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  FolderKanban,
  Plus,
  ExternalLink,
  Clock,
  Eye,
  ArrowRight,
  MessageSquare,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdminDictionary } from './AdminDictionaryProvider';
import { DataGrid } from './DataGrid';
import type { DataGridConfig } from '@/types/data-grid';
import { formatRelative } from '@/utils/format-date';

type RecentActivityItem = {
  id: string;
  type: 'blog' | 'project';
  title: string;
  status: string;
  locale: string;
  updatedAt: string;
  href: string;
};

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
  pendingReviewCount?: number;
  recentClients?: { id: string; name: string; createdAt: Date }[];
}

export default function DashboardContent({
  user,
  blogCount,
  projectCount,
  publishedBlogCount,
  publishedProjectCount,
  draftBlogCount,
  draftProjectCount,
  pendingReviewCount = 0,
  recentClients = [],
}: DashboardContentProps) {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.dashboard;
  const stats = dict.admin.dashboard.stats;

  const recentActivityConfig: DataGridConfig<RecentActivityItem> = {
    swrKey: 'dashboard-recent',
    fetcher: async ([, params]) => {
      const search = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });
      const res = await fetch(`/api/admin/dashboard/recent?${search}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      return json;
    },
    columns: [
      {
        name: 'type',
        label: 'Type',
        cell: (row) =>
          row.type === 'blog'
            ? dict.admin.sidebar.blogs
            : dict.admin.sidebar.projects,
      },
      {
        name: 'title',
        label: 'Title',
        cell: (row) => (
          <Link
            href={row.href}
            className="font-medium text-foreground hover:text-myorange-100 hover:underline"
          >
            {row.title}
          </Link>
        ),
      },
      {
        name: 'status',
        label: 'Status',
        cell: (row) => (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
              row.status === 'published'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {row.type === 'blog'
              ? dict.admin.blogs.status[row.status as 'draft' | 'published']
              : dict.admin.projects.status[row.status as 'draft' | 'published']}
          </span>
        ),
      },
      {
        name: 'locale',
        label: 'Locale',
        cell: (row) => (
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {row.locale}
          </span>
        ),
      },
      {
        name: 'updatedAt',
        label: 'Updated',
        cell: (row) => (
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            {formatRelative(row.updatedAt, 'fr')}
          </span>
        ),
      },
    ],
    actions: [
      {
        name: 'view',
        label: dict.admin.common.view,
        icon: Eye,
        onClick: (row) => router.push(row.href),
      },
    ],
    empty: {
      title: t.noRecentBlogs,
      description: t.noRecentProjects,
    },
    tableTitle: t.recentActivity,
    defaultPageSize: 10,
    className: '!space-y-4',
  };

  const displayName = user?.name || user?.email || 'User';
  const totalPublished = publishedBlogCount + publishedProjectCount;
  const totalDraft = draftBlogCount + draftProjectCount;

  return (
    <div className="flex flex-col gap-10">
      {/* Welcome + actions */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t.title}</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t.welcome.replace('{name}', displayName)}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            asChild
            size="sm"
            className="gap-1.5 bg-myorange-100 hover:bg-myorange-200"
          >
            <Link href="/admin/blogs/new">
              <Plus className="h-4 w-4" />
              {dict.admin.blogs.newBlog}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="gap-1.5">
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4" />
              {dict.admin.projects.newProject}
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="gap-1.5 text-muted-foreground"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              {t.viewSite}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats: single row, minimal */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Link
          href="/admin/blogs"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {blogCount}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {stats.totalBlogs}
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/projects"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {projectCount}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/blogs?status=published"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-emerald-500/10">
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {totalPublished}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {totalPublished}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {stats.publishedShort}
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/blogs?status=draft"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-amber-500/10">
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {totalDraft}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {totalDraft}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {stats.draftsShort}
              </p>
            </div>
          </div>
        </Link>
        <Link
          href="/admin/reviews?status=pending"
          className="rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-sky-500/10">
              <MessageSquare className="h-4 w-4 text-sky-600 dark:text-sky-400" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-semibold tabular-nums text-foreground">
                {pendingReviewCount}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {dict.admin.sidebar.reviews}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {(recentClients.length > 0 || pendingReviewCount > 0) && (
        <section className="grid gap-4 sm:grid-cols-2">
          {recentClients.length > 0 && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {dict.admin.sidebar.clients} (récent)
              </h2>
              <ul className="space-y-2">
                {recentClients.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="text-sm font-medium text-foreground hover:text-myorange-100 hover:underline"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* Recent activity */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {t.recentActivity}
          </h2>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            {t.viewAll}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <DataGrid config={recentActivityConfig} />
      </section>
    </div>
  );
}
