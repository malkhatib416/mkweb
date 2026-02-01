/**
 * Predefined language palette for the admin "new language" flow.
 * ISO 639-1 codes with English names (admin can use these to add languages).
 */

export type LanguagePaletteItem = {
  code: string;
  name: string;
};

/** Regional indicator symbols (A=U+1F1E6) → flag emoji for 2-letter ISO 3166 country code. */
function toFlagEmoji(countryCode: string): string {
  if (countryCode.length !== 2) return '';
  return countryCode
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(0x1f1e6 - 65 + c.charCodeAt(0)))
    .join('');
}

/** Language code → country code for flag display (avoids EN→🇪🇳, ZH→🇿🇭 etc.). */
const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  en: 'gb',
  zh: 'cn',
  ja: 'jp',
  ko: 'kr',
  ar: 'sa',
  he: 'il',
  hi: 'in',
  id: 'id',
  no: 'no',
  el: 'gr',
  cs: 'cz',
  da: 'dk',
  sv: 'se',
  tr: 'tr',
  th: 'th',
  vi: 'vn',
};

/** Returns flag emoji for display; uses country mapping when needed. */
export function getFlagEmoji(langCode: string): string {
  const country = LANGUAGE_TO_COUNTRY[langCode.toLowerCase()] ?? langCode;
  return toFlagEmoji(country);
}

export const LANGUAGES_PALETTE: LanguagePaletteItem[] = [
  { code: 'fr', name: 'French' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'ru', name: 'Russian' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'hi', name: 'Hindi' },
  { code: 'tr', name: 'Turkish' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'th', name: 'Thai' },
  { code: 'id', name: 'Indonesian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'da', name: 'Danish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'fi', name: 'Finnish' },
  { code: 'el', name: 'Greek' },
  { code: 'he', name: 'Hebrew' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'cs', name: 'Czech' },
  { code: 'sk', name: 'Slovak' },
  { code: 'bg', name: 'Bulgarian' },
];
