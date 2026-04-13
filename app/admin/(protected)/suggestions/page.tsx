'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { PageHeader } from '@/components/admin/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { fetcher } from '@/lib/swr-fetcher';
import { locales, type Locale } from '@/locales/i18n';
import type { Blog } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
import { generateSlug } from '@/utils/utils';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Copy,
  FileEdit,
  FolderTree,
  Lightbulb,
  Plus,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

type CreatedArticle = { id: string; locale: string; title: string };

type SuggestionsResponse = {
  data: {
    suggestions: string[];
    categorySuggestions: string[];
    latestArticles: Blog[];
    services: { key: string; title: string }[];
  };
};

type Category = { id: string; name: string; slug: string };
type CategoriesResponse = { data: Category[]; pagination: { total: number } };

const SUGGESTION_COUNTS = [5, 8, 12, 15] as const;
const STAGGER = 0.04;
const CACHE_KEY_PREFIX = 'admin_suggestions_';

function getCacheKey(locale: string, count: number, categoryIds: string[]) {
  const cat = categoryIds.length ? categoryIds.sort().join(',') : '';
  return `${CACHE_KEY_PREFIX}${locale}_${count}_${cat}`;
}

function loadCachedSuggestions(
  locale: string,
  count: number,
  categoryIds: string[],
): SuggestionsResponse | undefined {
  if (typeof sessionStorage === 'undefined') return undefined;
  try {
    const raw = sessionStorage.getItem(getCacheKey(locale, count, categoryIds));
    if (!raw) return undefined;
    return JSON.parse(raw) as SuggestionsResponse;
  } catch {
    return undefined;
  }
}

function saveCachedSuggestions(
  locale: string,
  count: number,
  categoryIds: string[],
  data: SuggestionsResponse,
) {
  if (typeof sessionStorage === 'undefined') return;
  try {
    sessionStorage.setItem(
      getCacheKey(locale, count, categoryIds),
      JSON.stringify(data),
    );
  } catch {
    // ignore
  }
}

function useSuggestions(
  locale: string,
  count: number,
  selectedCategoryIds: string[],
) {
  const categoryIds = useMemo(
    () => selectedCategoryIds.slice().sort(),
    [selectedCategoryIds],
  );
  const categoryIdsKey = useMemo(() => categoryIds.join(','), [categoryIds]);
  const key = useMemo(
    () =>
      `/api/admin/suggestions?locale=${locale}&count=${count}&categoryIds=${categoryIdsKey}`,
    [locale, count, categoryIdsKey],
  );
  const fallback = useMemo(
    () => loadCachedSuggestions(locale, count, categoryIds),
    [locale, count, categoryIds],
  );
  return useSWR<SuggestionsResponse>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: false,
    keepPreviousData: true,
    fallbackData: fallback,
  });
}

export default function SuggestionsPage() {
  const dict = useAdminDictionary();
  const t = dict.admin?.suggestions ?? {
    title: 'Content ideas',
    description: 'AI-suggested topics, latest articles and services',
    suggestionsTitle: 'Suggested topics',
    suggestionsDescription: 'Topics to attract clients and improve SEO',
    categorySuggestionsTitle: 'Suggested categories',
    categorySuggestionsDescription:
      'Category ideas to structure future articles and content clusters',
    latestArticles: 'Latest articles',
    services: 'Services',
    createArticle: 'Create article',
    refresh: 'Refresh',
    noSuggestions: 'No suggestions (configure OPENAI_API_KEY)',
    loading: 'Loading…',
    generating: 'Generating…',
    copyTopic: 'Copy',
    copyCategory: 'Copy category',
    copySuccess: 'Topic copied',
    noCategorySuggestions: 'No category suggestions yet.',
    localeFr: 'FR',
    localeEn: 'EN',
    suggestionsCount: 'Number of topics',
    categoriesHint: 'Select categories to focus suggestions. Refresh to apply.',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
  };

  const [locale, setLocale] = useState<Locale>('fr');
  const [count, setCount] = useState<number>(8);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const categoriesInitializedRef = useRef(false);
  const shouldReselectAllCategoriesRef = useRef(false);

  const {
    data: categoriesData,
    mutate: mutateCategories,
    isValidating: isCategoriesRefreshing,
  } = useSWR<CategoriesResponse>(
    `/api/admin/categories?limit=100&locale=${locale}`,
    fetcher,
  );
  const categories = useMemo(
    () => categoriesData?.data ?? [],
    [categoriesData],
  );

  useEffect(() => {
    if (categories.length > 0 && !categoriesInitializedRef.current) {
      setSelectedCategoryIds(new Set(categories.map((c) => c.id)));
      categoriesInitializedRef.current = true;
      return;
    }

    if (categories.length > 0 && shouldReselectAllCategoriesRef.current) {
      setSelectedCategoryIds(new Set(categories.map((c) => c.id)));
      shouldReselectAllCategoriesRef.current = false;
    }
  }, [categories]);

  const selectedCategoryIdsList = useMemo(
    () => Array.from(selectedCategoryIds),
    [selectedCategoryIds],
  );
  const { data, error, isLoading, isValidating, mutate } = useSuggestions(
    locale,
    count,
    selectedCategoryIdsList,
  );

  const suggestionsRaw = useMemo(() => data?.data?.suggestions ?? [], [data]);
  const categorySuggestions = useMemo(
    () => data?.data?.categorySuggestions ?? [],
    [data],
  );
  const services = data?.data?.services ?? [];
  const [removedSuggestions, setRemovedSuggestions] = useState<Set<string>>(
    () => new Set(),
  );
  const [removedCategorySuggestions, setRemovedCategorySuggestions] = useState<
    Set<string>
  >(() => new Set());
  const suggestions = useMemo(
    () => suggestionsRaw.filter((t) => !removedSuggestions.has(t)),
    [suggestionsRaw, removedSuggestions],
  );
  const visibleCategorySuggestions = useMemo(
    () =>
      categorySuggestions.filter(
        (category) => !removedCategorySuggestions.has(category),
      ),
    [categorySuggestions, removedCategorySuggestions],
  );
  const latestArticles = data?.data?.latestArticles ?? [];
  const selectedCategoriesCount = selectedCategoryIds.size;
  const showSkeleton = isLoading && !data;
  const isRefreshing = (isValidating && !!data) || isCategoriesRefreshing;

  useEffect(() => {
    if (data?.data) {
      saveCachedSuggestions(locale, count, selectedCategoryIdsList, data);
    }
  }, [data, locale, count, selectedCategoryIdsList]);

  const toggleCategory = useCallback((id: string) => {
    setSelectedCategoryIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const selectAllCategories = useCallback(() => {
    setSelectedCategoryIds(new Set(categories.map((c) => c.id)));
  }, [categories]);

  const deselectAllCategories = useCallback(() => {
    setSelectedCategoryIds(new Set());
  }, []);

  const [generatingTopic, setGeneratingTopic] = useState<string | null>(null);
  const [creatingCategory, setCreatingCategory] = useState<string | null>(null);
  const [createdForTopic, setCreatedForTopic] = useState<{
    topic: string;
    created: CreatedArticle[];
  } | null>(null);

  const handleCreateArticle = useCallback(
    async (topic: string) => {
      setGeneratingTopic(topic);
      setCreatedForTopic(null);
      try {
        const categoryId =
          selectedCategoryIds.size > 0
            ? Array.from(selectedCategoryIds)[0]
            : undefined;
        const res = await fetch('/api/admin/blogs/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, ...(categoryId && { categoryId }) }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? 'Generation failed');
        const created: CreatedArticle[] = json.data?.created ?? [];
        setCreatedForTopic({ topic, created });
        setRemovedSuggestions((prev) => new Set(prev).add(topic));
        const msg =
          created.length > 0
            ? (
                dict.admin?.blogs?.generateWithAI?.successMessage ??
                '{count} article(s) created.'
              ).replace('{count}', String(created.length))
            : 'No articles created.';
        toast.success(msg);
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : (dict.admin?.blogs?.generateWithAI?.errorMessage ??
                'Generation failed'),
        );
        console.error(err);
      } finally {
        setGeneratingTopic(null);
      }
    },
    [dict.admin?.blogs?.generateWithAI, selectedCategoryIds],
  );

  const handleCopy = useCallback(
    (topic: string) => {
      navigator.clipboard.writeText(topic).then(
        () => toast.success(t.copySuccess ?? 'Topic copied'),
        () => toast.error('Copy failed'),
      );
    },
    [t.copySuccess],
  );

  const handleCreateCategory = useCallback(
    async (name: string) => {
      const slug = generateSlug(name) || generateSlug(`category-${Date.now()}`);

      setCreatingCategory(name);

      try {
        const response = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            slug,
            locale,
          }),
        });

        const json = await response.json();

        if (!response.ok) {
          throw new Error(
            json.error ??
              dict.admin?.categories?.createError ??
              'Failed to create category',
          );
        }

        const createdCategoryId = json.data?.id as string | undefined;

        if (createdCategoryId) {
          setSelectedCategoryIds((prev) =>
            new Set(prev).add(createdCategoryId),
          );
        }

        setRemovedCategorySuggestions((prev) => new Set(prev).add(name));
        await mutateCategories();
        toast.success(
          dict.admin?.categories?.createSuccess ??
            'Category created successfully',
        );
      } catch (err) {
        toast.error(
          err instanceof Error
            ? err.message
            : (dict.admin?.categories?.createError ??
                'Failed to create category'),
        );
        console.error(err);
      } finally {
        setCreatingCategory(null);
      }
    },
    [
      dict.admin?.categories?.createError,
      dict.admin?.categories?.createSuccess,
      locale,
      mutateCategories,
    ],
  );

  const handleRefresh = useCallback(async () => {
    setRemovedSuggestions(new Set());
    setRemovedCategorySuggestions(new Set());

    const allCurrentlySelected =
      categories.length > 0 && selectedCategoryIds.size === categories.length;

    if (allCurrentlySelected) {
      shouldReselectAllCategoriesRef.current = true;
    }

    await Promise.all([mutate(), mutateCategories()]);
  }, [categories, mutate, mutateCategories, selectedCategoryIds.size]);

  if (error) {
    return (
      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-8">
        <PageHeader title={t.title} description={t.description} />
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">
              {error instanceof Error ? error.message : String(error)}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col gap-8">
      <PageHeader
        title={t.title}
        description={t.description}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={locale}
              onValueChange={(value) => setLocale(value as Locale)}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {locales.map((localeOption) => (
                  <SelectItem key={localeOption} value={localeOption}>
                    {localeOption.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(count)}
              onValueChange={(v) => setCount(Number(v))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder={t.suggestionsCount} />
              </SelectTrigger>
              <SelectContent>
                {SUGGESTION_COUNTS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5"
            >
              {isRefreshing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              {t.refresh}
            </Button>
          </div>
        }
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-card to-muted/20 shadow-xl">
          <div className="border-b border-border/60 bg-myorange-100/5 px-6 py-8 sm:px-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-myorange-100 text-white shadow-lg shadow-myorange-100/20">
                  <Lightbulb className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight">
                    {t.suggestionsTitle}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground/80">
                    {t.suggestionsDescription}
                  </p>
                </div>
              </div>
              {isRefreshing && (
                <div className="flex items-center gap-2 rounded-full bg-myorange-100/10 px-3 py-1 text-xs font-medium text-myorange-100 animate-in fade-in zoom-in">
                  <RefreshCw className="h-3 w-3 animate-spin" />
                  {t.loading}
                </div>
              )}
            </div>
          </div>

          <CardContent className="px-6 pb-8 pt-6 sm:px-8">
            {createdForTopic && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  {createdForTopic.created.length > 0
                    ? (dict.admin?.blogs?.generateWithAI?.successTitle ??
                      'Articles created')
                    : ''}
                </div>
                <ul className="flex flex-wrap gap-2">
                  {createdForTopic.created.map((a) => (
                    <motion.li
                      key={a.id}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        href={`/admin/blogs/${a.id}/edit`}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-emerald-50 hover:text-emerald-600 dark:bg-muted dark:hover:bg-emerald-500/10"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                        {a.title} ({a.locale})
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}

            {showSkeleton ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {Array.from({ length: Math.max(count, 4) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/50 p-4"
                  >
                    <Skeleton className="h-4 w-3/4" />
                    <div className="mt-2 flex justify-end gap-2">
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <Skeleton className="h-8 w-24 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : suggestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                  <Lightbulb className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  {t.noSuggestions}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {suggestions.map((topic, i) => (
                  <motion.div
                    key={`${topic}-${i}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * STAGGER, duration: 0.3 }}
                    className="group flex flex-col justify-between rounded-2xl border border-border/60 bg-background/60 p-5 shadow-sm transition-all hover:border-myorange-100/30 hover:bg-background hover:shadow-md"
                  >
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <h3 className="text-sm font-semibold leading-relaxed text-foreground group-hover:text-myorange-100 transition-colors">
                        {topic}
                      </h3>
                    </div>
                    <div className="mt-6 flex items-center justify-end gap-2">
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        className="h-9 w-9 rounded-xl text-muted-foreground transition-all hover:bg-myorange-100/10 hover:text-myorange-100"
                        onClick={() => handleCopy(topic)}
                        title={t.copyTopic ?? 'Copy'}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-9 gap-1.5 rounded-xl px-3 font-semibold text-foreground transition-all hover:bg-myorange-100 hover:text-white"
                        disabled={generatingTopic !== null}
                        onClick={() => handleCreateArticle(topic)}
                      >
                        {generatingTopic === topic ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span className="text-xs uppercase tracking-wider">
                              {t.generating ?? 'Generating…'}
                            </span>
                          </>
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            <span className="text-xs uppercase tracking-wider">
                              {t.createArticle}
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6 xl:sticky xl:top-6 xl:h-fit">
          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="text-base">{t.refresh}</CardTitle>
              <p className="text-xs text-muted-foreground">
                {t.categoriesHint ??
                  'Select categories to focus suggestions. Refresh to apply.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-2xl border border-border/60 bg-muted/30 px-3 py-3">
                  <p className="break-words text-[10px] font-mono uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                    {t.suggestionsCount}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {count}
                  </p>
                </div>
                <div className="min-w-0 rounded-2xl border border-border/60 bg-muted/30 px-3 py-3">
                  <p className="break-words text-[10px] font-mono uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                    {dict.admin?.sidebar?.categories ?? 'Categories'}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {selectedCategoriesCount}
                  </p>
                </div>
                <div className="col-span-2 min-w-0 rounded-2xl border border-border/60 bg-muted/30 px-3 py-3">
                  <p className="break-words text-[10px] font-mono uppercase leading-relaxed tracking-[0.18em] text-muted-foreground">
                    {t.services}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                    {services.length}
                  </p>
                </div>
              </div>

              {services.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <span
                      key={service.key}
                      className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {service.title}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <FolderTree className="h-4 w-4 text-muted-foreground" />
                {dict.admin?.sidebar?.categories ?? 'Categories'}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {t.categoriesHint ??
                  'Select categories to focus suggestions. Refresh to apply.'}
              </p>
            </CardHeader>
            <CardContent>
              {categories.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {dict.admin?.categories?.noCategories ?? 'No categories yet.'}
                </p>
              ) : (
                <>
                  <div className="mb-4 flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 px-4 py-3">
                    <div>
                      <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
                        {dict.admin?.sidebar?.categories ?? 'Categories'}
                      </p>
                      <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                        {selectedCategoriesCount}/{categories.length}
                      </p>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={selectAllCategories}
                        className="block text-foreground hover:underline"
                      >
                        {t.selectAll ?? 'Select all'}
                      </button>
                      <button
                        type="button"
                        onClick={deselectAllCategories}
                        className="mt-1 block text-foreground hover:underline"
                      >
                        {t.deselectAll ?? 'Deselect all'}
                      </button>
                    </div>
                  </div>

                  <ul className="space-y-2">
                    {categories.map((c, i) => (
                      <motion.li
                        key={c.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * STAGGER, duration: 0.2 }}
                      >
                        <label
                          htmlFor={`cat-${c.id}`}
                          className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-foreground transition-colors hover:bg-muted/50"
                        >
                          <input
                            type="checkbox"
                            id={`cat-${c.id}`}
                            checked={selectedCategoryIds.has(c.id)}
                            onChange={() => toggleCategory(c.id)}
                            className="h-4 w-4 rounded border-border text-foreground focus:ring-foreground"
                            aria-label={c.name}
                          />
                          <span className="min-w-0 flex-1 truncate font-medium">
                            {c.name}
                          </span>
                        </label>
                      </motion.li>
                    ))}
                  </ul>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <Card className="overflow-hidden border-none bg-gradient-to-br from-card to-muted/20 shadow-lg">
          <div className="border-b border-border/60 bg-myorange-100/5 px-6 py-6 sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg dark:bg-white dark:text-slate-950">
                <FolderTree className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">
                  {t.categorySuggestionsTitle ?? 'Suggested categories'}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground/80">
                  {t.categorySuggestionsDescription ??
                    'Category ideas to structure future articles and content clusters'}
                </p>
              </div>
            </div>
          </div>
          <CardContent className="px-6 pb-8 pt-6 sm:px-8">
            {showSkeleton ? (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-2xl" />
                ))}
              </div>
            ) : visibleCategorySuggestions.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {t.noCategorySuggestions ?? 'No category suggestions yet.'}
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {visibleCategorySuggestions.map((category, i) => (
                  <motion.button
                    key={category}
                    type="button"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * STAGGER, duration: 0.2 }}
                    onClick={() => handleCreateCategory(category)}
                    disabled={creatingCategory !== null}
                    className="group flex min-h-20 flex-col items-start justify-between rounded-2xl border border-border/70 bg-background/80 p-4 text-left shadow-sm transition-all hover:border-myorange-100/40 hover:bg-myorange-100/5 hover:shadow-md"
                    title={
                      dict.admin?.categories?.createSuccess ?? 'Create category'
                    }
                  >
                    <span className="text-[11px] font-mono uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-myorange-100">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex w-full items-end justify-between gap-3">
                      <span className="text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-myorange-100">
                        {category}
                      </span>
                      {creatingCategory === category ? (
                        <RefreshCw className="h-4 w-4 shrink-0 animate-spin text-myorange-100" />
                      ) : (
                        <Plus className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-myorange-100" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileEdit className="h-4 w-4 text-muted-foreground" />
              {t.latestArticles}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {showSkeleton ? (
              <ul className="space-y-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-2 py-1.5"
                  >
                    <Skeleton className="h-4 flex-1 max-w-[80%]" />
                    <Skeleton className="h-3 w-16" />
                  </li>
                ))}
              </ul>
            ) : latestArticles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                {dict.admin?.blogs?.noBlogs ?? 'No articles yet.'}
              </p>
            ) : (
              <ul className="space-y-1">
                {latestArticles.slice(0, 10).map((blog, i) => (
                  <motion.li
                    key={blog.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * STAGGER, duration: 0.2 }}
                  >
                    <Link
                      href={`/admin/blogs/${blog.id}/edit`}
                      className="flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <span className="min-w-0 flex-1 truncate">
                        {blog.title}
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDate(blog.createdAt, 'fr')}
                      </span>
                    </Link>
                  </motion.li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
