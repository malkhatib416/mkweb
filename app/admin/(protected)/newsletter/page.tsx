'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { DataGrid } from '@/components/admin/DataGrid';
import { PageHeader } from '@/components/admin/PageHeader';
import { newsletterService } from '@/lib/services/newsletter.service';
import type { DataGridConfig } from '@/types/data-grid';
import type { NewsletterSubscriber } from '@/types/entities';
import { formatDate } from '@/utils/format-date';

export default function AdminNewsletterPage() {
  const dict = useAdminDictionary();
  const t = dict.admin.newsletter;

  const config: DataGridConfig<NewsletterSubscriber> = {
    swrKey: 'admin-newsletter',
    fetcher: async ([, params]) =>
      newsletterService.getAll({ page: params.page, limit: params.limit }),
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
  };

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-8">
      <PageHeader title={t.subtitle} description={t.title} />
      <DataGrid config={config} />
    </div>
  );
}
