'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { fetcher } from '@/lib/swr-fetcher';
import type { LanguageResponse } from '@/types/entities';
import { formatDateTime } from '@/utils/format-date';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function ViewLanguagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.languages;

  const { data, error, isLoading } = useSWR<LanguageResponse>(
    id ? `/api/admin/languages/${id}` : null,
    fetcher,
  );

  const language = data?.data;

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/languages');
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card py-16">
        <Loading label={t.loading} />
      </div>
    );
  }

  if (!language) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/languages"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToLanguages}
        </Link>
        <Button
          size="sm"
          className="gap-1.5 bg-myorange-100 hover:bg-myorange-200"
          asChild
        >
          <Link href={`/admin/languages/${id}/edit`}>
            <Edit className="h-4 w-4" />
            {t.view.edit}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {language.name}
          </h1>
          <p className="text-muted-foreground">
            <span className="font-medium text-foreground">
              {t.fields.code}:
            </span>{' '}
            {language.code}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              {t.metadata.created}: {formatDateTime(language.createdAt, 'fr')}
            </span>
            <span>
              {t.metadata.updated}: {formatDateTime(language.updatedAt, 'fr')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0" />
      </Card>
    </div>
  );
}
