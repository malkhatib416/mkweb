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
import type { Blog } from '@/types/entities';
import { formatDate } from '@/utils/format-date';
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
  const key = useMemo(
    () =>
      `/api/admin/suggestions?locale=${locale}&count=${count}&categoryIds=${categoryIds.join(',')}`,
    [locale, count, categoryIds.join(',')],
  );
  const fallback = useMemo(
    () => loadCachedSuggestions(locale, count, categoryIds),
    [locale, count, categoryIds.join(',')],
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
    latestArticles: 'Latest articles',
    services: 'Services',
    createArticle: 'Create article',
    refresh: 'Refresh',
    noSuggestions: 'No suggestions (configure OPENAI_API_KEY)',
    loading: 'Loading…',
    generating: 'Generating…',
    copyTopic: 'Copy',
    copySuccess: 'Topic copied',
    localeFr: 'FR',
    localeEn: 'EN',
    suggestionsCount: 'Number of topics',
    categoriesHint: 'Select categories to focus suggestions. Refresh to apply.',
    selectAll: 'Select all',
    deselectAll: 'Deselect all',
  };

  const [locale, setLocale] = useState<'fr' | 'en'>('fr');
  const [count, setCount] = useState<number>(8);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(
    () => new Set(),
  );
  const categoriesInitializedRef = useRef(false);

  const { data: categoriesData } = useSWR<CategoriesResponse>(
    '/api/admin/categories?limit=100',
    fetcher,
  );
  const categories = categoriesData?.data ?? [];

  useEffect(() => {
    if (categories.length > 0 && !categoriesInitializedRef.current) {
      setSelectedCategoryIds(new Set(categories.map((c) => c.id)));
      categoriesInitializedRef.current = true;
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

  const suggestionsRaw = data?.data?.suggestions ?? [];
  const [removedSuggestions, setRemovedSuggestions] = useState<Set<string>>(
    () => new Set(),
  );
  const suggestions = useMemo(
    () => suggestionsRaw.filter((t) => !removedSuggestions.has(t)),
    [suggestionsRaw, removedSuggestions],
  );
  const latestArticles = data?.data?.latestArticles ?? [];
  const showSkeleton = isLoading && !data;
  const isRefreshing = isValidating && !!data;

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
              onValueChange={(v) => setLocale(v as 'fr' | 'en')}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fr">{t.localeFr ?? 'FR'}</SelectItem>
                <SelectItem value="en">{t.localeEn ?? 'EN'}</SelectItem>
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
              onClick={() => {
                setRemovedSuggestions(new Set());
                mutate();
              }}
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

      {/* AI-suggested topics */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-card to-muted/20 shadow-xl">
        <div className="bg-myorange-100/5 px-6 py-8 sm:px-8">
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

        <CardContent className="px-6 pb-8 sm:px-8">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {Array.from({ length: Math.max(count, 4) }).map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-background/50 p-4"
                >
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex justify-end gap-2 mt-2">
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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              {suggestions.map((topic, i) => (
                <motion.div
                  key={`${topic}-${i}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * STAGGER, duration: 0.3 }}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/50 bg-background/40 p-5 shadow-sm transition-all hover:border-myorange-100/30 hover:bg-background hover:shadow-md dark:bg-muted/20"
                >
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold leading-relaxed text-foreground group-hover:text-myorange-100 transition-colors">
                      {topic}
                    </h3>
                  </div>
                  <div className="flex items-center justify-end gap-2">
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

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Latest articles */}
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
                      className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted hover:text-foreground"
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

        {/* Categories (select to filter suggestions) */}
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
                <div className="mb-2 flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={selectAllCategories}
                    className="text-foreground hover:underline"
                  >
                    {t.selectAll ?? 'Select all'}
                  </button>
                  <span className="text-muted-foreground">|</span>
                  <button
                    type="button"
                    onClick={deselectAllCategories}
                    className="text-foreground hover:underline"
                  >
                    {t.deselectAll ?? 'Deselect all'}
                  </button>
                </div>
                <ul className="space-y-1">
                  {categories.map((c, i) => (
                    <motion.li
                      key={c.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * STAGGER, duration: 0.2 }}
                      className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-muted/60"
                    >
                      <input
                        type="checkbox"
                        id={`cat-${c.id}`}
                        checked={selectedCategoryIds.has(c.id)}
                        onChange={() => toggleCategory(c.id)}
                        className="h-4 w-4 rounded border-border text-foreground focus:ring-foreground"
                        aria-label={c.name}
                      />
                      <label
                        htmlFor={`cat-${c.id}`}
                        className="cursor-pointer flex-1 select-none"
                      >
                        {c.name}
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
  );
}
