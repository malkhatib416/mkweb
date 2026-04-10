'use client';

import type { Locale } from '@/locales/i18n';
import 'flag-icons/css/flag-icons.min.css';

const localeToCountryCode = {
  fr: 'FR',
  en: 'GB',
  de: 'DE',
  it: 'IT',
  es: 'ES',
} as const satisfies Record<Locale, string>;

export type CountryCode =
  | Uppercase<Locale>
  | (typeof localeToCountryCode)[Locale];

type Props = {
  countryCode: CountryCode;
  className?: string;
};

const countryClassMap: Record<CountryCode, string> = {
  FR: 'fi fi-fr',
  GB: 'fi fi-gb',
  EN: 'fi fi-gb', // English uses GB flag
  DE: 'fi fi-de',
  IT: 'fi fi-it',
  ES: 'fi fi-es',
};

export default function CountryFlag({ countryCode, className = '' }: Props) {
  return <span className={`fi ${countryClassMap[countryCode]} ${className}`} />;
}
