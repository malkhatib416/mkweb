'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { TranslationCoverage } from '@/components/admin/TranslationCoverage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loading } from '@/components/ui/loading';
import { useAdminLanguages } from '@/lib/hooks/use-admin-languages';
import { getBlogImageUrl, useBlog } from '@/lib/hooks/use-blog';
import { MarkdownRenderer } from '@/lib/markdown';
import type { Locale } from '@/types/entities';
import { formatDateTime } from '@/utils/format-date';
import { ArrowLeft, Edit } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function ViewBlogPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = (params?.id as string) ?? null;
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;
  const translationT = t.translation;
  const initialLocale = searchParams.get('locale') ?? undefined;
  const [locale, setLocale] = useState<Locale | undefined>(initialLocale);

  const { blog, error, isLoading } = useBlog(id, locale);
  const [imgError, setImgError] = useState(false);
  const imageUrl = blog ? getBlogImageUrl(blog) : null;
  const selectedLocale = locale ?? blog?.locale;
  const { localeLabels } = useAdminLanguages({
    adminLocaleLabels: t.locale,
    includeLocales: [selectedLocale],
  });

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/blogs');
  }

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-card py-16">
        <Loading label={t.loading} />
      </div>
    );
  }

  if (!blog) return null;

  const localeOptions = Array.from(
    new Set([
      ...Object.keys(localeLabels),
      ...(blog.translations?.map((item) => item.locale) ?? []),
      blog.locale,
      ...(selectedLocale ? [selectedLocale] : []),
    ]),
  );

  const hasSelectedTranslation = selectedLocale
    ? (blog.translations?.some((item) => item.locale === selectedLocale) ??
      false)
    : true;
  const displayTitle = hasSelectedTranslation
    ? blog.title
    : translationT.missingTitle;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.backToBlogs}
        </Link>
        <Button
          size="sm"
          className="gap-1.5 bg-myorange-100 hover:bg-myorange-100/90"
          asChild
        >
          <Link
            href={`/admin/blogs/${id}/edit${selectedLocale ? `?locale=${selectedLocale}` : ''}`}
          >
            <Edit className="h-4 w-4" />
            {t.view.edit}
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-none shadow-xl">
        {imageUrl && !imgError && (
          <div className="relative h-64 w-full overflow-hidden sm:h-80 lg:h-96">
            <Image
              src={imageUrl}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              unoptimized
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8">
              <span
                className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-sm ${
                  blog.status === 'published'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white/90 text-slate-900 backdrop-blur-sm'
                }`}
              >
                {t.status[blog.status as keyof typeof t.status]}
              </span>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
                {displayTitle}
              </h1>
            </div>
          </div>
        )}

        {!imageUrl || imgError ? (
          <CardHeader className="space-y-4 border-b border-border/50 bg-muted/30 pb-8 pt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  blog.status === 'published'
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-muted-foreground/10 text-muted-foreground text-white'
                }`}
              >
                {t.status[blog.status as keyof typeof t.status]}
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {displayTitle}
            </h1>
            {hasSelectedTranslation && blog.description && (
              <p className="max-w-3xl text-lg text-muted-foreground">
                {blog.description}
              </p>
            )}
          </CardHeader>
        ) : (
          <div className="border-b border-border/50 bg-muted/10 px-6 py-6 sm:px-8">
            {hasSelectedTranslation && blog.description && (
              <p className="max-w-3xl text-lg font-medium text-foreground/80 italic border-l-4 border-myorange-100 pl-4 py-1">
                {blog.description}
              </p>
            )}
          </div>
        )}

        <div className="bg-muted/5 px-6 py-4 sm:px-8">
          <div className="flex flex-col gap-4">
            <TranslationCoverage
              translations={blog.translations}
              currentLocale={selectedLocale}
              localeLabels={localeLabels}
              locales={localeOptions}
              labels={translationT}
            />

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <span className="opacity-50">{t.fields.locale}:</span>
                <select
                  value={selectedLocale ?? blog.locale}
                  onChange={(event) => setLocale(event.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground"
                >
                  {localeOptions.map((localeOption) => (
                    <option key={localeOption} value={localeOption}>
                      {localeLabels[localeOption] ?? localeOption.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="opacity-50">{t.metadata.slug}:</span>
                <span className="text-foreground">{blog.slug}</span>
              </div>
              {(blog as { readingTime?: number | null }).readingTime !=
                null && (
                <div className="flex items-center gap-1.5">
                  <span className="opacity-50">
                    {t.fields.readingTime ?? 'Reading time'}:
                  </span>
                  <span className="text-foreground">
                    {(blog as { readingTime: number }).readingTime} min
                  </span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <span className="opacity-50">{t.metadata.created}:</span>
                <span className="text-foreground">
                  {formatDateTime(blog.createdAt, 'fr')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="px-6 py-10 sm:px-10">
          {hasSelectedTranslation ? (
            <div className="prose prose-slate max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-myorange-100">
              <MarkdownRenderer content={blog.content} />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/70 px-5 py-6 text-sm text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-100">
              {translationT.missingDescription.replace(
                '{locale}',
                selectedLocale
                  ? (localeLabels[selectedLocale] ??
                      selectedLocale.toUpperCase())
                  : '',
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
