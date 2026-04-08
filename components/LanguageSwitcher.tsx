'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { locales, type Locale } from '@/locales/i18n';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback } from 'react';
import CountryFlag from './CountryFlag';

type Props = {
  currentLocale: Locale;
};

const localeData: Record<Locale, { name: string; flagCode: 'FR' | 'GB' }> = {
  fr: { name: 'Français', flagCode: 'FR' },
  en: { name: 'English', flagCode: 'GB' },
};

export default function LanguageSwitcher({ currentLocale }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = useCallback(
    async (newLocale: Locale) => {
      if (newLocale === currentLocale) return;

      // Set cookie for locale preference
      document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

      const fallbackPath = pathname.replace(
        `/${currentLocale}`,
        `/${newLocale}`,
      );
      let targetPath = fallbackPath || `/${newLocale}`;

      try {
        const response = await fetch(
          `/api/i18n/resolve-path?pathname=${encodeURIComponent(
            pathname,
          )}&targetLocale=${newLocale}`,
        );

        if (response.ok) {
          const data = (await response.json()) as { pathname?: string };
          if (data.pathname) {
            targetPath = data.pathname;
          }
        }
      } catch {
        // Ignore lookup failures and fall back to a simple locale prefix swap.
      }

      // Navigate to the new locale URL, then refresh so server components
      // re-run with the new locale header from the proxy
      router.push(targetPath);
      router.refresh();
    },
    [currentLocale, pathname, router],
  );

  return (
    <Select value={currentLocale} onValueChange={switchLocale}>
      <SelectTrigger
        className="w-[140px] min-h-12"
        aria-label="Select language"
      >
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            <span className="flex items-center gap-2">
              <CountryFlag countryCode={localeData[locale].flagCode} />
              {localeData[locale].name}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
