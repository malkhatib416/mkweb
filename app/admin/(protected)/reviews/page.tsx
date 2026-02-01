'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { PageHeader } from '@/components/admin/PageHeader';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { projectReviewService } from '@/lib/services/project-review.service';
import { fetcher } from '@/lib/swr-fetcher';
import type { DataGridConfig } from '@/types/data-grid';
import type { ProjectReviewAdminRow } from '@/types/entities';
import { APP_URL } from '@/utils/consts';
import { formatDate } from '@/utils/format-date';
import { Copy, Plus } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

const EMPTY_FILTER_VALUE = '__all__';

type ProjectsResponse = { data: { id: string; title: string }[] };
type ClientsResponse = { data: { id: string; name: string }[] };

export default function AdminReviewsPage() {
  const dict = useAdminDictionary();
  const t = dict.admin.reviews;
  const [createOpen, setCreateOpen] = useState(false);
  const [projectId, setProjectId] = useState('');
  const [clientId, setClientId] = useState('');
  const [expiryDays, setExpiryDays] = useState(30);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const gridMutateRef = useRef<(() => Promise<unknown>) | null>(null);

  const projectsKey = createOpen ? '/api/admin/projects?limit=500' : null;
  const clientsKey = createOpen ? '/api/admin/clients?limit=500' : null;
  const { data: projectsData } = useSWR<ProjectsResponse>(projectsKey, fetcher);
  const { data: clientsData } = useSWR<ClientsResponse>(clientsKey, fetcher);
  const projects = projectsData?.data ?? [];
  const clients = clientsData?.data ?? [];

  const copyReviewLink = useCallback(
    (token: string) => {
      const url = `${typeof window !== 'undefined' ? window.location.origin : APP_URL}/fr/review/${token}`;
      void navigator.clipboard.writeText(url);
      toast.success(t.copyLink);
    },
    [t.copyLink],
  );

  const handleCreateOpen = useCallback((open: boolean) => {
    setCreateOpen(open);
    if (open) {
      setProjectId('');
      setClientId('');
      setExpiryDays(30);
    }
  }, []);

  const handleCreateSubmit = useCallback(async () => {
    if (!projectId || !clientId) {
      toast.error(dict.admin.common.required);
      return;
    }
    setLoadingCreate(true);
    try {
      const res = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, clientId, expiryDays }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t.createError);
      toast.success(t.createSuccess);
      setCreateOpen(false);
      await gridMutateRef.current?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.createError);
    } finally {
      setLoadingCreate(false);
    }
  }, [
    projectId,
    clientId,
    expiryDays,
    t.createSuccess,
    t.createError,
    dict.admin.common.required,
  ]);

  const config: DataGridConfig<ProjectReviewAdminRow> = {
    swrKey: 'admin-reviews',
    fetcher: async ([, params]) =>
      projectReviewService.getList({
        page: params.page,
        limit: params.limit,
        status:
          params.status && params.status !== EMPTY_FILTER_VALUE
            ? (params.status as 'pending' | 'submitted')
            : undefined,
      }),
    filters: [
      {
        name: 'status',
        type: 'select',
        placeholder: t.status,
        options: [
          { value: EMPTY_FILTER_VALUE, label: t.filterAll },
          { value: 'pending', label: t.filterPending },
          { value: 'submitted', label: t.filterSubmitted },
        ],
        allowEmpty: true,
        emptyLabel: t.filterAll,
      },
    ],
    columns: [
      {
        name: 'projectTitle',
        label: t.project,
        cell: (row) => <span className="font-medium">{row.projectTitle}</span>,
      },
      {
        name: 'clientName',
        label: t.client,
        cell: (row) => (
          <span className="text-muted-foreground">{row.clientName}</span>
        ),
      },
      {
        name: 'status',
        label: t.status,
        cell: (row) => (
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-xs font-medium ${
              row.submittedAt
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
            }`}
          >
            {row.submittedAt ? t.submitted : t.pending}
          </span>
        ),
      },
      {
        name: 'date',
        label: t.expiresAt,
        cell: (row) => {
          const d = row.submittedAt ? row.submittedAt : row.tokenExpiresAt;
          const label = row.submittedAt ? t.submittedAt : t.expiresAt;
          return (
            <span className="text-sm text-muted-foreground" title={label}>
              {formatDate(d, 'fr')}
            </span>
          );
        },
      },
    ],
    actions: [
      {
        name: 'copy',
        label: t.copyLink,
        icon: Copy,
        onClick: (row) => copyReviewLink(row.token),
      },
    ],
    empty: { title: t.noReviews, description: t.subtitle },
    defaultPageSize: 10,
    className: '!space-y-4',
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={t.subtitle}
        description={dict.admin.reviews.title}
        actions={
          <AlertDialog open={createOpen} onOpenChange={handleCreateOpen}>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                className="gap-1.5 bg-myorange-100 hover:bg-myorange-100/90"
              >
                <Plus className="h-4 w-4" />
                {t.createLink}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t.createLink}</AlertDialogTitle>
                <AlertDialogDescription>
                  Choisissez un projet et un client pour générer un lien
                  d&apos;avis.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>{t.project}</Label>
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un projet" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>{t.client}</Label>
                  <Select value={clientId} onValueChange={setClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Jours avant expiration</Label>
                  <Input
                    type="number"
                    min={1}
                    max={365}
                    value={expiryDays}
                    onChange={(e) =>
                      setExpiryDays(parseInt(e.target.value, 10) || 30)
                    }
                  />
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  {dict.admin.common.cancel}
                </AlertDialogCancel>
                <Button onClick={handleCreateSubmit} disabled={loadingCreate}>
                  {loadingCreate ? dict.admin.common.loading : t.createLink}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        }
      />

      <DataGrid
        config={config}
        onMutateReady={(fn) => {
          gridMutateRef.current = fn;
        }}
      />
    </div>
  );
}
