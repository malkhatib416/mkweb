'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { fetcher } from '@/lib/swr-fetcher';
import type { ClientResponse } from '@/types/entities';
import { formatDateTime } from '@/utils/format-date';
import { Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function ViewClientPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.clients;

  const { data, error, isLoading } = useSWR<ClientResponse>(
    id ? `/api/admin/clients/${id}` : null,
    fetcher,
  );

  const client = data?.data;

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/clients');
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card py-16">
        <Loading label={t.loading} />
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={client.name}
        description={t.view.edit}
        backHref="/admin/clients"
        backLabel={t.backToClients}
        actions={
          <Button
            size="sm"
            className="gap-1.5 bg-myorange-100 hover:bg-myorange-100/90"
            asChild
          >
            <Link href={`/admin/clients/${id}/edit`}>
              <Edit className="h-4 w-4" />
              {t.view.edit}
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader className="space-y-4 pb-4">
          <div className="flex flex-wrap items-start gap-4">
            {client.photo ? (
              <Image
                src={client.photo}
                alt=""
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-full object-cover"
                unoptimized
              />
            ) : (
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-muted text-2xl font-medium text-muted-foreground">
                {client.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="min-w-0 flex-1 space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {client.name}
              </h1>
              {client.company && (
                <p className="text-muted-foreground">{client.company}</p>
              )}
              {client.email && (
                <a
                  href={`mailto:${client.email}`}
                  className="text-sm text-foreground hover:underline"
                >
                  {client.email}
                </a>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              {t.metadata.created}: {formatDateTime(client.createdAt, 'fr')}
            </span>
            <span>
              {t.metadata.updated}: {formatDateTime(client.updatedAt, 'fr')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0" />
      </Card>
    </div>
  );
}
