'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { languageService } from '@/lib/services/language.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { Language } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function LanguagesPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.languages;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const gridMutateRef = useRef<(() => Promise<unknown>) | null>(null);

  const handleDeleteClick = (lang: Language) => {
    setItemToDelete({ id: lang.id, name: lang.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await languageService.delete(itemToDelete.id);
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

  const config: DataGridConfig<Language> = {
    swrKey: 'admin-languages',
    fetcher: async ([, params]) => {
      const search = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });
      const res = await fetch(`/api/admin/languages?${search}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      return json;
    },
    columns: [
      {
        name: 'code',
        label: t.fields.code,
        cell: (row) => (
          <Link
            href={`/admin/languages/${row.id}`}
            className="font-medium text-foreground hover:text-foreground hover:underline"
          >
            {row.code}
          </Link>
        ),
      },
      {
        name: 'name',
        label: t.fields.name,
        cell: (row) => (
          <span className="text-sm text-muted-foreground">{row.name}</span>
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
        onClick: (row) => router.push(`/admin/languages/${row.id}`),
      },
      {
        name: 'edit',
        label: dict.admin.common.edit,
        icon: Edit,
        onClick: (row) => router.push(`/admin/languages/${row.id}/edit`),
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
      title: t.noLanguages,
      description: t.subtitle,
      createLabel: t.createFirst,
      onCreate: () => router.push('/admin/languages/new'),
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
          <Link href="/admin/languages/new">
            <Button
              size="sm"
              className="gap-1.5 bg-myorange-100 hover:bg-myorange-100/90"
            >
              <Plus className="h-4 w-4" />
              {t.newLanguage}
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
