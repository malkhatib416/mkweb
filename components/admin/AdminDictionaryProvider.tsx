'use client';

import { createContext, useContext, ReactNode } from 'react';
import type { Dictionary } from '@/locales/dictionaries';

const AdminDictionaryContext = createContext<Dictionary | null>(null);

export function AdminDictionaryProvider({
  dict,
  children,
}: {
  dict: Dictionary;
  children: ReactNode;
}) {
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
