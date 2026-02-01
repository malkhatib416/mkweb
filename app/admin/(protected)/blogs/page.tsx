'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { getBlogImageUrl } from '@/lib/hooks/use-blog';
import { blogService } from '@/lib/services/blog.service';
import { fetcher } from '@/lib/swr-fetcher';
import type { Locale } from '@/locales/i18n';
import type { DataGridConfig } from '@/types/data-grid';
import type { Blog, CategoryListResponse, Status } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

/** Thumbnail or letter placeholder; never shows broken/red image. */
function BlogImageCell({ row }: { row: Blog }) {
  const blog = row as Blog & { image?: string | null };
  const imageUrl = getBlogImageUrl(blog);
  const [imgError, setImgError] = useState(false);
  const letter = (row.title || '?').charAt(0).toUpperCase();
  const hue = titleToHue(row.title || '');

  return (
    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded-md bg-muted/50 ring-1 ring-border/50 shadow-sm transition-transform hover:scale-110 group-hover:shadow-md">
      {imageUrl && !imgError ? (
        <Image
          src={imageUrl}
          alt=""
          width={64}
          height={40}
          className="h-full w-full object-cover"
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className="flex h-full w-full items-center justify-center text-xs font-bold text-white uppercase tracking-tighter"
          style={{ backgroundColor: `hsl(${hue}, 55%, 45%)` }}
        >
          {letter}
        </div>
      )}
    </div>
  );
}

const EMPTY_FILTER_VALUE = '__all__';

/** Stable hue from title for context-based placeholder. */
function titleToHue(title: string): number {
  let h = 0;
  for (let i = 0; i < title.length; i++)
    h = (h * 31 + title.charCodeAt(i)) >>> 0;
  return h % 360;
}

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

  const { data: categoriesData } = useSWR<CategoryListResponse>(
    '/api/admin/categories',
    fetcher,
  );
  const categories = categoriesData?.data ?? [];

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
    fetcher: async ([, params]) =>
      blogService.getAll({
        page: params.page,
        limit: params.limit,
        status:
          params.status && params.status !== EMPTY_FILTER_VALUE
            ? (params.status as Status)
            : undefined,
        locale:
          params.locale && params.locale !== EMPTY_FILTER_VALUE
            ? (params.locale as Locale)
            : undefined,
        categoryId:
          params.categoryId && params.categoryId !== EMPTY_FILTER_VALUE
            ? params.categoryId
            : undefined,
      }),
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
        placeholder: t.filterLanguage ?? t.fields.locale,
        options: [
          { value: 'fr', label: t.locale.fr },
          { value: 'en', label: t.locale.en },
        ],
        allowEmpty: true,
        emptyLabel: dict.admin.common.all,
      },
      {
        type: 'select',
        name: 'categoryId',
        placeholder: t.fields.category ?? 'Category',
        options: categories.map((c) => ({ value: c.id, label: c.name })),
        allowEmpty: true,
        emptyLabel: dict.admin.common.all,
      },
    ],
    columns: [
      {
        name: 'image',
        label: t.image ?? 'Image',
        width: 'w-14',
        cell: (row) => <BlogImageCell row={row} />,
      },
      {
        name: 'title',
        label: t.fields.title,
        cell: (row) => (
          <Link
            href={`/admin/blogs/${row.id}`}
            className="font-medium text-foreground hover:text-foreground hover:underline"
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
        name: 'category',
        label: t.fields.category ?? 'Category',
        cell: (row) => {
          const cat = (row as Blog & { category?: { name: string } | null })
            .category;
          return (
            <span className="text-sm text-muted-foreground">
              {cat?.name ?? '—'}
            </span>
          );
        },
      },
      {
        name: 'readingTime',
        label: t.fields.readingTime ?? 'Reading time (min)',
        cell: (row) => {
          const rt = (row as Blog & { readingTime?: number | null })
            .readingTime;
          return (
            <span className="text-sm text-muted-foreground">
              {rt != null ? `${rt} min` : '—'}
            </span>
          );
        },
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
        variant: 'ghost',
        className:
          'h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive',
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

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title={dict.admin.common.delete}
        description={
          itemToDelete
            ? t.deleteConfirm.replace('{title}', itemToDelete.title)
            : ''
        }
        cancelLabel={dict.admin.common.cancel}
        confirmLabel={dict.admin.common.delete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
