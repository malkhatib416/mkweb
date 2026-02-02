'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { projectService } from '@/lib/services/project.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { Locale, Project, Status } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ProjectsPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.projects;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const gridMutateRef = useRef<(() => Promise<unknown>) | null>(null);

  const handleDeleteClick = (project: Project) => {
    setItemToDelete({ id: project.id, title: project.title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await projectService.delete(itemToDelete.id);
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

  const config: DataGridConfig<Project> = {
    swrKey: 'admin-projects',
    fetcher: async ([, params]) =>
      projectService.getAll({
        page: params.page,
        limit: params.limit,
        status:
          params.status && params.status !== '__all__'
            ? (params.status as Status)
            : undefined,
        locale:
          params.locale && params.locale !== '__all__'
            ? (params.locale as Locale)
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
            href={`/admin/projects/${row.id}`}
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
        onClick: (row) => router.push(`/admin/projects/${row.id}`),
      },
      {
        name: 'edit',
        label: dict.admin.common.edit,
        icon: Edit,
        onClick: (row) => router.push(`/admin/projects/${row.id}/edit`),
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
      title: t.noProjects,
      description: t.subtitle,
      createLabel: t.createFirst,
      onCreate: () => router.push('/admin/projects/new'),
    },
    defaultPageSize: 10,
  };

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-8">
      <PageHeader
        title={t.subtitle}
        description={t.title}
        actions={
          <Link href="/admin/projects/new">
            <Button
              size="sm"
              className="gap-1.5 bg-myorange-100 hover:bg-myorange-200"
            >
              <Plus className="h-4 w-4" />
              {t.newProject}
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
