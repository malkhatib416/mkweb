'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { MarkdownRenderer } from '@/lib/markdown';
import { fetcher } from '@/lib/swr-fetcher';
import type { BlogResponse } from '@/types/entities';
import { formatDateTime } from '@/utils/format-date';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function ViewBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;

  const { data, error, isLoading } = useSWR<BlogResponse>(
    id ? `/api/admin/blogs/${id}` : null,
    fetcher,
  );

  const blog = data?.data;

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/blogs');
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card py-16">
        <Loading label={t.loading} />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToBlogs}
        </Link>
        <Button
          size="sm"
          className="gap-1.5 bg-myorange-100 hover:bg-myorange-200"
          asChild
        >
          <Link href={`/admin/blogs/${id}/edit`}>
            <Edit className="h-4 w-4" />
            {t.view.edit}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              {blog.title}
            </h1>
            <span
              className={`inline-flex shrink-0 items-center rounded-md px-2.5 py-1 text-xs font-medium ${
                blog.status === 'published'
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {t.status[blog.status]}
            </span>
          </div>
          {blog.description && (
            <p className="text-muted-foreground">{blog.description}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              {t.metadata.slug}: {blog.slug}
            </span>
            <span>
              {t.fields.locale}: {t.locale[blog.locale]}
            </span>
            <span>
              {t.metadata.created}: {formatDateTime(blog.createdAt, 'fr')}
            </span>
            <span>
              {t.metadata.updated}: {formatDateTime(blog.updatedAt, 'fr')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <MarkdownRenderer content={blog.content} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
