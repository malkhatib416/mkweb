'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { Loading } from '@/components/ui/loading';
import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import { defaultLocale } from '@/locales/i18n';

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
  const [dict, setDict] = useState<Dictionary | null>(initialDict ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialDict != null) {
      setDict(initialDict);
      return;
    }
    let cancelled = false;
    fetch(`${DICTIONARY_API}?locale=${locale}`)
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setDict(data as Dictionary);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? 'Failed to load dictionary');
      });
    return () => {
      cancelled = true;
    };
  }, [locale, initialDict]);

  if (error) {
    return (
      <div className="flex min-h-[200px] items-center justify-center text-destructive">
        {error}
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
