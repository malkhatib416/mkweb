'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PageHeader } from '@/components/admin/PageHeader';
import { TranslationCoverage } from '@/components/admin/TranslationCoverage';
import { Button } from '@/components/ui/button';
import { useAdminLanguages } from '@/lib/hooks/use-admin-languages';
import { useEntityDelete } from '@/lib/hooks/use-entity-delete';
import { categoryService } from '@/lib/services/category.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { Category, Locale } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.categories;
  const localeT = dict.admin.blogs.locale;
  const translationT = t.translation;
  const { localeLabels, localeOptions: localeFilterOptions } =
    useAdminLanguages({
      adminLocaleLabels: localeT,
    });
  const {
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    selectedItem,
    requestDelete,
    confirmDelete,
    onMutateReady,
  } = useEntityDelete<Category>({
    deleteEntity: categoryService.delete.bind(categoryService),
    getSelection: (category) => ({ id: category.id, label: category.name }),
    successMessage: t.deleteSuccess,
    errorMessage: t.deleteError,
  });

  const config: DataGridConfig<Category> = {
    swrKey: 'admin-categories',
    fetcher: async ([, params]) =>
      categoryService.getAll({
        page: params.page,
        limit: params.limit,
        locale: (params.locale as Locale | undefined) ?? 'fr',
      }),
    filters: [
      {
        type: 'select',
        name: 'locale',
        placeholder: dict.admin.blogs.fields.locale,
        options: localeFilterOptions,
      },
    ],
    columns: [
      {
        name: 'name',
        label: t.fields.name,
        cell: (row) => (
          <Link
            href={`/admin/categories/${row.id}?locale=${row.locale}`}
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
        name: 'translations',
        label: translationT.title,
        cell: (row) => (
          <TranslationCoverage
            translations={row.translations}
            currentLocale={row.locale}
            localeLabels={localeLabels}
            locales={localeFilterOptions.map((option) => option.value)}
            labels={translationT}
            compact
          />
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
        onClick: (row) =>
          router.push(`/admin/categories/${row.id}?locale=${row.locale}`),
      },
      {
        name: 'edit',
        label: dict.admin.common.edit,
        icon: Edit,
        onClick: (row) =>
          router.push(`/admin/categories/${row.id}/edit?locale=${row.locale}`),
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
