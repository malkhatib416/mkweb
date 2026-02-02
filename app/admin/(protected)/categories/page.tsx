'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { categoryService } from '@/lib/services/category.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { Category } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function CategoriesPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.categories;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const gridMutateRef = useRef<(() => Promise<unknown>) | null>(null);

  const handleDeleteClick = (cat: Category) => {
    setItemToDelete({ id: cat.id, name: cat.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await categoryService.delete(itemToDelete.id);
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

  const config: DataGridConfig<Category> = {
    swrKey: 'admin-categories',
    fetcher: async ([, params]) =>
      categoryService.getAll({ page: params.page, limit: params.limit }),
    columns: [
      {
        name: 'name',
        label: t.fields.name,
        cell: (row) => (
          <Link
            href={`/admin/categories/${row.id}`}
            className="font-medium text-foreground hover:text-foreground hover:underline"
          >
            {row.name}
          </Link>
        ),
      },
      {
        name: 'slug',
        label: t.fields.slug,
        cell: (row) => (
          <span className="text-sm text-muted-foreground font-mono">
            {row.slug}
          </span>
        ),
      },
      {
        name: 'description',
        label: t.fields.description,
        cell: (row) => (
          <span className="text-sm text-muted-foreground line-clamp-2 max-w-xs">
            {row.description ?? '—'}
          </span>
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
        onClick: (row) => router.push(`/admin/categories/${row.id}`),
      },
      {
        name: 'edit',
        label: dict.admin.common.edit,
        icon: Edit,
        onClick: (row) => router.push(`/admin/categories/${row.id}/edit`),
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
      title: t.noCategories,
      description: t.subtitle,
      createLabel: t.createFirst,
      onCreate: () => router.push('/admin/categories/new'),
    },
    defaultPageSize: 10,
  };

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-8">
      <PageHeader
        title={t.subtitle}
        description={t.title}
        actions={
          <Link href="/admin/categories/new">
            <Button
              size="sm"
              className="gap-1.5 bg-myorange-100 hover:bg-myorange-200"
            >
              <Plus className="h-4 w-4" />
              {t.newCategory}
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
            ? t.deleteConfirm.replace('{name}', itemToDelete.name)
            : ''
        }
        cancelLabel={dict.admin.common.cancel}
        confirmLabel={dict.admin.common.delete}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
