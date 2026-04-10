'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { TranslationCoverage } from '@/components/admin/TranslationCoverage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { useAdminLanguages } from '@/lib/hooks/use-admin-languages';
import { resolveLocale } from '@/locales/i18n';
import { fetcher } from '@/lib/swr-fetcher';
import type { CategoryResponse, Locale } from '@/types/entities';
import { formatDateTime } from '@/utils/format-date';
import { ArrowLeft, Edit } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function ViewCategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.categories;
  const localeT = dict.admin.blogs.locale;
  const translationT = t.translation;
  const [locale, setLocale] = useState<Locale | undefined>(() =>
    resolveLocale(searchParams.get('locale')),
  );

  const { data, error, isLoading } = useSWR<CategoryResponse>(
    id
      ? `/api/admin/categories/${id}${locale ? `?locale=${locale}` : ''}`
      : null,
    fetcher,
  );

  const category = data?.data;
  const selectedLocale = locale ?? category?.locale;
  const { localeLabels } = useAdminLanguages({
    adminLocaleLabels: localeT,
    includeLocales: [selectedLocale],
  });

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

  const localeOptions = Array.from(
    new Set([
      ...Object.keys(localeLabels),
      ...(category.translations?.map((item) => item.locale) ?? []),
      category.locale,
      ...(selectedLocale ? [selectedLocale] : []),
    ]),
  );
  const hasSelectedTranslation = selectedLocale
    ? (category.translations?.some((item) => item.locale === selectedLocale) ??
      false)
    : true;
  const displayName = hasSelectedTranslation
    ? category.name
    : translationT.missingTitle;

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
          <Link
            href={`/admin/categories/${id}/edit${selectedLocale ? `?locale=${selectedLocale}` : ''}`}
          >
            <Edit className="h-4 w-4" />
            {t.view.edit}
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="space-y-4 pb-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {displayName}
          </h1>
          <TranslationCoverage
            translations={category.translations}
            currentLocale={selectedLocale}
            localeLabels={localeLabels}
            locales={localeOptions}
            labels={translationT}
          />
          {hasSelectedTranslation ? (
            <p className="font-mono text-sm text-muted-foreground">
              {t.fields.slug}: {category.slug}
            </p>
          ) : null}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{dict.admin.blogs.fields.locale}:</span>
            <select
              value={selectedLocale ?? category.locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm text-foreground"
            >
              {localeOptions.map((localeOption) => (
                <option key={localeOption} value={localeOption}>
                  {localeLabels[localeOption] ?? localeOption.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          {hasSelectedTranslation && category.description && (
            <p className="text-muted-foreground">{category.description}</p>
          )}
          {!hasSelectedTranslation ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {translationT.missingDescription.replace(
                '{locale}',
                selectedLocale
                  ? (localeLabels[selectedLocale] ??
                      selectedLocale.toUpperCase())
                  : '',
              )}
            </p>
          ) : null}
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
