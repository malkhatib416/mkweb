'use client';

import { useAdminDictionary } from './AdminDictionaryProvider';
import { LayoutGrid } from 'lucide-react';

export default function AdminBranding() {
  const dict = useAdminDictionary();
  const t = dict.admin;

  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
        <LayoutGrid className="h-5 w-5" aria-hidden />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {t.brandingTitle}
        </span>
        <span className="text-xs font-normal text-gray-500 dark:text-gray-400">
          {t.brandingSubtitle}
        </span>
      </div>
    </div>
  );
}
