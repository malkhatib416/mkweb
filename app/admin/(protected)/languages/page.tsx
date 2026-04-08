'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { useEntityDelete } from '@/lib/hooks/use-entity-delete';
import { languageService } from '@/lib/services/language.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { Language } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LanguagesPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.languages;
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedItem,
    requestDelete,
    confirmDelete,
    onMutateReady,
  } = useEntityDelete<Language>({
    deleteEntity: languageService.delete.bind(languageService),
    getSelection: (language) => ({ id: language.id, label: language.name }),
    successMessage: t.deleteSuccess,
    errorMessage: t.deleteError,
  });

  const config: DataGridConfig<Language> = {
    swrKey: 'admin-languages',
    fetcher: async ([, params]) =>
      languageService.getAll({ page: params.page, limit: params.limit }),
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
        onClick: (row) => requestDelete(row),
      },
    ],
    empty: {
      title: t.noLanguages,
      description: t.subtitle,
      createLabel: t.createFirst,
      onCreate: () => router.push('/admin/languages/new'),
    },
    defaultPageSize: 10,
  };

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-8">
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
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title={dict.admin.common.delete}
        description={
          selectedItem
            ? t.deleteConfirm.replace('{name}', selectedItem.label)
            : ''
        }
        cancelLabel={dict.admin.common.cancel}
        confirmLabel={dict.admin.common.delete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
