'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { blogService } from '@/lib/services/blog.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { Blog } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function BlogsPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.blogs;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const gridMutateRef = useRef<(() => Promise<unknown>) | null>(null);

  const handleDeleteClick = (blog: Blog) => {
    setItemToDelete({ id: blog.id, title: blog.title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await blogService.delete(itemToDelete.id);
      toast.success(t.deleteSuccess);
      await gridMutateRef.current?.();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.deleteError);
      console.error(err);
    }
  };

  const onMutateReady = useCallback((mutateFn: () => Promise<unknown>) => {
    gridMutateRef.current = mutateFn;
  }, []);

  const config: DataGridConfig<Blog> = {
    swrKey: 'admin-blogs',
    fetcher: async ([, params]) => {
      const search = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });
      if (params.status) search.set('status', params.status);
      if (params.locale) search.set('locale', params.locale);
      const res = await fetch(`/api/admin/blogs?${search}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      return json;
    },
    filters: [
      {
        type: 'select',
        name: 'status',
        placeholder: t.fields.status,
        options: [
          { value: 'draft', label: t.status.draft },
          { value: 'published', label: t.status.published },
        ],
        allowEmpty: true,
        emptyLabel: dict.admin.common.all,
      },
      {
        type: 'select',
        name: 'locale',
        placeholder: t.fields.locale,
        options: [
          { value: 'fr', label: t.locale.fr },
          { value: 'en', label: t.locale.en },
        ],
        allowEmpty: true,
        emptyLabel: dict.admin.common.all,
      },
    ],
    columns: [
      {
        name: 'title',
        label: t.fields.title,
        cell: (row) => (
          <Link
            href={`/admin/blogs/${row.id}`}
            className="font-medium text-foreground hover:text-myorange-100 hover:underline"
          >
            {row.title}
          </Link>
        ),
      },
      {
        name: 'status',
        label: t.fields.status,
        cell: (row) => (
          <span
            className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
              row.status === 'published'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {t.status[row.status]}
          </span>
        ),
      },
      {
        name: 'locale',
        label: t.fields.locale,
        cell: (row) => (
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            {row.locale}
          </span>
        ),
      },
      {
        name: 'slug',
        label: t.metadata.slug,
        cell: (row) => (
          <span className="text-sm text-muted-foreground">{row.slug}</span>
        ),
      },
      {
        name: 'createdAt',
        label: t.metadata.created,
        cell: (row) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.createdAt, 'fr')}
          </span>
        ),
      },
    ],
    actions: [
      {
        name: 'view',
        label: dict.admin.common.view,
        icon: Eye,
        onClick: (row) => router.push(`/admin/blogs/${row.id}`),
      },
      {
        name: 'edit',
        label: dict.admin.common.edit,
        icon: Edit,
        onClick: (row) => router.push(`/admin/blogs/${row.id}/edit`),
      },
      {
        name: 'delete',
        label: dict.admin.common.delete,
        icon: Trash2,
        variant: 'destructive',
        className:
          'text-destructive hover:bg-destructive/10 hover:text-destructive',
        onClick: (row) => handleDeleteClick(row),
      },
    ],
    empty: {
      title: t.noBlogs,
      description: t.subtitle,
      createLabel: t.createFirst,
      onCreate: () => router.push('/admin/blogs/new'),
    },
    defaultPageSize: 10,
    className: '!space-y-4',
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={t.subtitle}
        description={t.title}
        actions={
          <Link href="/admin/blogs/new">
            <Button
              size="sm"
              className="gap-1.5 bg-myorange-100 hover:bg-myorange-200"
            >
              <Plus className="h-4 w-4" />
              {t.newBlog}
            </Button>
          </Link>
        }
      />

      <DataGrid config={config} onMutateReady={onMutateReady} />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.admin.common.delete}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete &&
                t.deleteConfirm.replace('{title}', itemToDelete.title)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.admin.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {dict.admin.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
