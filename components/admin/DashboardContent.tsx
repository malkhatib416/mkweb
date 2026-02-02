'use client';

import { Button } from '@/components/ui/button';
import type { DataGridConfig } from '@/types/data-grid';
import { formatRelative } from '@/utils/format-date';
import {
  ArrowRight,
  Clock,
  ExternalLink,
  Eye,
  FileText,
  FolderKanban,
  MessageSquare,
  Plus,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminDictionary } from './AdminDictionaryProvider';
import { DataGrid } from './DataGrid';

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
            className="font-medium text-foreground hover:text-foreground/70 hover:underline"
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
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight border ${
              row.status === 'published'
                ? 'bg-emerald-50/50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                : 'bg-muted/50 text-muted-foreground border-border/50'
            }`}
          >
            <span
              className={`h-1 w-1 rounded-full ${row.status === 'published' ? 'bg-emerald-500' : 'bg-muted-foreground/40'}`}
            />
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
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
            {t.title}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {t.welcome.replace('{name}', displayName)}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            asChild
            size="sm"
            className="h-9 gap-2 bg-myorange-100 text-white hover:bg-myorange-200"
          >
            <Link href="/admin/blogs/new">
              <Plus className="h-4 w-4" />
              {dict.admin.blogs.newBlog}
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="h-9 gap-2 border-border/50 hover:bg-muted/50"
          >
            <Link href="/admin/projects/new">
              <Plus className="h-4 w-4" />
              {dict.admin.projects.newProject}
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            variant="ghost"
            className="h-9 gap-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
          >
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
              {t.viewSite}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats: single row, minimal */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <Link
          href="/admin/blogs"
          className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 transition-all hover:border-border/80 hover:bg-muted/30"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-colors group-hover:text-foreground">
                <FileText className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {blogCount}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                {stats.totalBlogs}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/projects"
          className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 transition-all hover:border-border/80 hover:bg-muted/30"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground shadow-sm transition-colors group-hover:text-foreground">
                <FolderKanban className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {projectCount}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                {stats.totalProjects}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/blogs?status=published"
          className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 transition-all hover:border-border/80 hover:bg-muted/30"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-emerald-600/80 shadow-sm transition-colors group-hover:text-emerald-600">
                <span className="text-xs font-bold uppercase tracking-tighter">
                  Pub
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {totalPublished}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                {stats.publishedShort}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/blogs?status=draft"
          className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 transition-all hover:border-border/80 hover:bg-muted/30"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-amber-600/80 shadow-sm transition-colors group-hover:text-amber-600">
                <span className="text-xs font-bold uppercase tracking-tighter">
                  Draft
                </span>
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {totalDraft}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                {stats.draftsShort}
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reviews?status=pending"
          className="group relative overflow-hidden rounded-xl border border-border bg-background p-5 transition-all hover:border-border/80 hover:bg-muted/30"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-background text-sky-600/80 shadow-sm transition-colors group-hover:text-sky-600">
                <MessageSquare className="h-5 w-5" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                {pendingReviewCount}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-foreground/80">
                {stats.pendingReviewsShort}
              </p>
            </div>
          </div>
        </Link>
      </div>

      {(recentClients.length > 0 || pendingReviewCount > 0) && (
        <section className="grid gap-6 sm:grid-cols-2">
          {recentClients.length > 0 && (
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                <Users className="h-4 w-4" />
                {dict.admin.sidebar.clients}
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                {t.recentClientsSubtitle}
              </p>
              <ul className="divide-y divide-border/50">
                {recentClients.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/admin/clients/${c.id}`}
                      className="block py-3 text-sm font-medium text-foreground transition-colors hover:text-foreground/70"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {pendingReviewCount > 0 && (
            <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
              <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                <MessageSquare className="h-4 w-4" />
                {dict.admin.sidebar.reviews}
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                {t.pendingReviewsSubtitle}
              </p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground">
                  {pendingReviewCount}{' '}
                  <span className="text-lg font-medium text-muted-foreground">
                    {pendingReviewCount === 1
                      ? t.pendingReviewSingular
                      : t.pendingReviewPlural}
                  </span>
                </p>
                <Button
                  asChild
                  size="sm"
                  variant="outline"
                  className="rounded-full px-4"
                >
                  <Link href="/admin/reviews?status=pending">
                    {t.viewPendingReviews}
                  </Link>
                </Button>
              </div>
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
