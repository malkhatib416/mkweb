'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { fetcher } from '@/lib/swr-fetcher';
import type { CategoryResponse } from '@/types/entities';
import { formatDateTime } from '@/utils/format-date';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function ViewCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.categories;

  const { data, error, isLoading } = useSWR<CategoryResponse>(
    id ? `/api/admin/categories/${id}` : null,
    fetcher,
  );

  const category = data?.data;

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/categories');
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card py-16">
        <Loading label={t.loading} />
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToCategories}
        </Link>
        <Button
          size="sm"
          className="gap-1.5 bg-myorange-100 hover:bg-myorange-100/90"
          asChild
        >
          <Link href={`/admin/categories/${id}/edit`}>
            <Edit className="h-4 w-4" />
            {t.view.edit}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {category.name}
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            {t.fields.slug}: {category.slug}
          </p>
          {category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              {t.metadata.created}: {formatDateTime(category.createdAt, 'fr')}
            </span>
            <span>
              {t.metadata.updated}: {formatDateTime(category.updatedAt, 'fr')}
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-0" />
      </Card>
    </div>
  );
}
