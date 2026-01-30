'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';

type AdminCommonKey =
  | 'common.filter'
  | 'common.search'
  | 'common.columns'
  | 'common.resetColumns'
  | 'common.actions'
  | 'common.emptyState.noResults'
  | 'pagination.pageOf'
  | 'pagination.perPage';

/**
 * Returns a translation function for admin DataGrid/common keys.
 * Must be used within AdminDictionaryProvider.
 */
export function useTranslations(): {
  t: (key: AdminCommonKey, params?: Record<string, string>) => string;
} {
  const dict = useAdminDictionary();
  const common = dict.admin.common as Record<string, unknown> & {
    emptyState?: { noResults?: string };
    pagination?: { pageOf?: string; perPage?: string };
  };

  const t = (key: AdminCommonKey, params?: Record<string, string>): string => {
    let out: string;
    if (key === 'pagination.pageOf') {
      out = common.pagination?.pageOf ?? 'Page {current} of {total}';
    } else if (key === 'pagination.perPage') {
      out = common.pagination?.perPage ?? 'per page';
    } else {
      const parts = key.split('.');
      if (parts[0] !== 'common') return key;
      if (parts.length === 2) {
        const v = common[parts[1]];
        out = typeof v === 'string' ? v : key;
      } else if (parts.length === 3 && parts[1] === 'emptyState') {
        out = common.emptyState?.noResults ?? key;
      } else {
        out = key;
      }
    }
    if (params) {
      return Object.entries(params).reduce(
        (acc, [k, v]) => acc.replace(`{${k}}`, v),
        out,
      );
    }
    return out;
  };

  return { t };
}
