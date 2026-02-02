'use client';

import { Loading } from '@/components/ui/loading';
import { fetcher } from '@/lib/swr-fetcher';
import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import { defaultLocale } from '@/locales/i18n';
import { ReactNode, createContext, useContext } from 'react';
import useSWR from 'swr';

const AdminDictionaryContext = createContext<Dictionary | null>(null);

const DICTIONARY_API = '/api/admin/dictionary';

export function AdminDictionaryProvider({
  dict: initialDict,
  locale = defaultLocale,
  children,
}: {
  dict?: Dictionary;
  locale?: Locale;
  children: ReactNode;
}) {
  const key = initialDict == null ? `${DICTIONARY_API}?locale=${locale}` : null;
  const { data, error, isLoading } = useSWR<Dictionary>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
  });
  const dict = initialDict ?? data ?? null;

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-destructive">
        {error instanceof Error ? error.message : 'Failed to load dictionary'}
      </div>
    );
  }

  if (dict == null) {
    return (
      <Loading
        variant="text"
        label="Loading…"
        className="min-h-[200px] text-muted-foreground"
      />
    );
  }

  return (
    <AdminDictionaryContext.Provider value={dict}>
      {children}
    </AdminDictionaryContext.Provider>
  );
}

export function useAdminDictionary() {
  const dict = useContext(AdminDictionaryContext);
  if (!dict) {
    throw new Error(
      'useAdminDictionary must be used within AdminDictionaryProvider',
    );
  }
  return dict;
}
