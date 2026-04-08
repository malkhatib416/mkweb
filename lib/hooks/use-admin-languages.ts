'use client';

import { fetcher } from '@/lib/swr-fetcher';
import type { LanguageListResponse } from '@/types/api';
import useSWR from 'swr';

type AdminLocaleLabels = {
  fr: string;
  en: string;
};

type UseAdminLanguagesOptions = {
  adminLocaleLabels?: AdminLocaleLabels;
  fallbackLabels?: Record<string, string>;
  includeLocales?: Array<string | null | undefined>;
};

export function useAdminLanguages(options: UseAdminLanguagesOptions = {}) {
  const { adminLocaleLabels, fallbackLabels = {}, includeLocales = [] } =
    options;

  const resolvedFallbackLabels = adminLocaleLabels
    ? {
        fr: adminLocaleLabels.fr,
        en: adminLocaleLabels.en,
        ...fallbackLabels,
      }
    : fallbackLabels;

  const { data, error, isLoading } = useSWR<LanguageListResponse>(
    '/api/admin/languages?limit=100',
    fetcher,
  );

  const localeLabels = (data?.data ?? []).reduce<Record<string, string>>(
    (accumulator, language) => {
      accumulator[language.code] = language.name;
      return accumulator;
    },
    { ...resolvedFallbackLabels },
  );

  const localeCodes = Array.from(
    new Set([
      ...Object.keys(localeLabels),
      ...(data?.data.map((language) => language.code) ?? []),
      ...includeLocales.filter((locale): locale is string => Boolean(locale)),
    ]),
  );

  return {
    languages: data?.data ?? [],
    localeLabels,
    localeCodes,
    localeOptions: localeCodes.map((locale) => ({
      value: locale,
      label: localeLabels[locale] ?? locale.toUpperCase(),
    })),
    error,
    isLoading,
  };
}