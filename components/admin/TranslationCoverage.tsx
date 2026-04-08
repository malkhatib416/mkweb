'use client';

import { cn } from '@/utils/utils';

type TranslationLike = {
  locale: string;
};

type TranslationCoverageLabels = {
  available: string;
  missing: string;
  coverage: string;
  currentMissing: string;
};

type TranslationCoverageProps = {
  translations?: TranslationLike[];
  currentLocale?: string;
  localeLabels: Record<string, string>;
  locales?: string[];
  labels: TranslationCoverageLabels;
  compact?: boolean;
  className?: string;
};

function formatLabel(template: string, replacements: Record<string, string>) {
  return Object.entries(replacements).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, value),
    template,
  );
}

export function TranslationCoverage({
  translations = [],
  currentLocale,
  localeLabels,
  locales,
  labels,
  compact = false,
  className,
}: TranslationCoverageProps) {
  const availableLocales = new Set(translations.map((item) => item.locale));
  const displayedLocales =
    locales && locales.length > 0
      ? locales
      : Array.from(
          new Set([
            ...Object.keys(localeLabels),
            ...translations.map((item) => item.locale),
            ...(currentLocale ? [currentLocale] : []),
          ]),
        ).sort();
  const availableCount = displayedLocales.filter((locale) =>
    availableLocales.has(locale),
  ).length;
  const coverageText = formatLabel(labels.coverage, {
    count: String(availableCount),
    total: String(displayedLocales.length),
  });
  const isCurrentMissing = currentLocale
    ? !availableLocales.has(currentLocale)
    : false;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground',
            compact && 'px-2 py-0.5 text-[10px]',
          )}
        >
          {coverageText}
        </span>
        {displayedLocales.map((locale) => {
          const isAvailable = availableLocales.has(locale);
          const isCurrent = currentLocale === locale;

          return (
            <span
              key={locale}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium',
                compact && 'px-2 py-0.5 text-[10px]',
                isAvailable
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                  : 'bg-muted text-muted-foreground',
                isCurrent &&
                  'ring-1 ring-myorange-100 ring-offset-1 ring-offset-background',
              )}
            >
              <span className="uppercase tracking-wider">{locale}</span>
              <span className="normal-case tracking-normal opacity-80">
                {localeLabels[locale] ?? locale.toUpperCase()}
              </span>
              <span className="opacity-70">
                {isAvailable ? labels.available : labels.missing}
              </span>
            </span>
          );
        })}
      </div>

      {isCurrentMissing && currentLocale ? (
        <p className="text-sm text-amber-700 dark:text-amber-300">
          {formatLabel(labels.currentMissing, {
            locale: localeLabels[currentLocale] ?? currentLocale.toUpperCase(),
          })}
        </p>
      ) : null}
    </div>
  );
}
