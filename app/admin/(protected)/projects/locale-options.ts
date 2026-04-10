import type { Locale } from "@/locales/i18n";

export const PROJECT_LOCALE_OPTIONS: Array<{
  value: Locale;
  label: string;
}> = [
  { value: "fr", label: "Francais" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "it", label: "Italiano" },
  { value: "es", label: "Español" },
];

export const PROJECT_LOCALE_LABELS = Object.fromEntries(
  PROJECT_LOCALE_OPTIONS.map(({ value, label }) => [value, label])
) as Record<Locale, string>;
