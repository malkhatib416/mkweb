'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { clientService } from '@/lib/services/client.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { Client } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ClientsPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.clients;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const gridMutateRef = useRef<(() => Promise<unknown>) | null>(null);

  const handleDeleteClick = (client: Client) => {
    setItemToDelete({ id: client.id, name: client.name });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    try {
      await clientService.delete(itemToDelete.id);
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

  const config: DataGridConfig<Client> = {
    swrKey: 'admin-clients',
    fetcher: async ([, params]) => {
      const search = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });
      const res = await fetch(`/api/admin/clients?${search}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      return json;
    },
    columns: [
      {
        name: 'photo',
        label: t.fields.photo,
        width: 'w-12',
        cell: (row) =>
          row.photo ? (
            <Image
              src={row.photo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
              {row.name.charAt(0).toUpperCase()}
            </span>
          ),
      },
      {
        name: 'name',
        label: t.fields.name,
        cell: (row) => (
          <Link
            href={`/admin/clients/${row.id}`}
            className="font-medium text-foreground hover:text-myorange-100 hover:underline"
          >
            {row.name}
          </Link>
        ),
      },
      {
        name: 'email',
        label: t.fields.email,
        cell: (row) => (
          <span className="text-sm text-muted-foreground">
            {row.email ?? '—'}
          </span>
        ),
      },
      {
        name: 'company',
        label: t.fields.company,
        cell: (row) => (
          <span className="text-sm text-muted-foreground">
            {row.company ?? '—'}
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
        onClick: (row) => router.push(`/admin/clients/${row.id}`),
      },
      {
        name: 'edit',
        label: dict.admin.common.edit,
        icon: Edit,
        onClick: (row) => router.push(`/admin/clients/${row.id}/edit`),
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
      title: t.noClients,
      description: t.subtitle,
      createLabel: t.createFirst,
      onCreate: () => router.push('/admin/clients/new'),
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
          <Link href="/admin/clients/new">
            <Button
              size="sm"
              className="gap-1.5 bg-myorange-100 hover:bg-myorange-200"
            >
              <Plus className="h-4 w-4" />
              {t.newClient}
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
