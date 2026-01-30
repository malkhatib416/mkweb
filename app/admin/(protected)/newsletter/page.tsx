'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { PageHeader } from '@/components/admin/PageHeader';
import type { DataGridConfig } from '@/types/data-grid';
import type { NewsletterSubscriber } from '@/types/entities';
import { formatDate } from '@/utils/format-date';

export default function AdminNewsletterPage() {
  const dict = useAdminDictionary();
  const t = dict.admin.newsletter;

  const config: DataGridConfig<NewsletterSubscriber> = {
    swrKey: 'admin-newsletter',
    fetcher: async ([, params]) => {
      const search = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
      });
      const res = await fetch(`/api/admin/newsletter?${search}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch');
      return json;
    },
    columns: [
      {
        name: 'email',
        label: t.email,
        cell: (row) => <span className="font-medium">{row.email}</span>,
      },
      {
        name: 'locale',
        label: t.locale,
        cell: (row) => (
          <span className="uppercase text-muted-foreground text-sm">
            {row.locale}
          </span>
        ),
      },
      {
        name: 'createdAt',
        label: t.createdAt,
        cell: (row) => (
          <span className="text-sm text-muted-foreground">
            {formatDate(row.createdAt, 'fr')}
          </span>
        ),
      },
    ],
    empty: { title: t.noSubscribers, description: t.subtitle },
    defaultPageSize: 10,
    className: '!space-y-4',
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={t.subtitle} description={t.title} />
      <DataGrid config={config} />
    </div>
  );
}
