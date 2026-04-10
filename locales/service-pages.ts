import en from './dictionaries/service-pages-en.json';
import fr from './dictionaries/service-pages-fr.json';
import type { Locale } from './i18n';

const dictionaries = { fr, en } as const;
const pageOrder = [
  'showcase',
  'webapp',
  'mobileapp',
  'ecommerce',
  'redesign',
  'maintenance',
] as const;

export type ServicePageDictionary = typeof fr;
export type ServicePageLabels = ServicePageDictionary['labels'];
export type ServicePageKey = (typeof pageOrder)[number];
export type ServicePageContent = ServicePageDictionary['pages'][ServicePageKey];

export function getServicePageLabels(locale: Locale) {
  return dictionaries[locale].labels;
}

export function getServicePageByKey(locale: Locale, key: ServicePageKey) {
  return dictionaries[locale].pages[key];
}

export function getServicePages(locale: Locale) {
  return pageOrder.map((key) => dictionaries[locale].pages[key]);
}

export function getServicePageBySlug(locale: Locale, slug: string) {
  return getServicePages(locale).find((page) => page.slug === slug) ?? null;
}

export function getServiceLinks(locale: Locale) {
  return pageOrder.map((key) => {
    const page = dictionaries[locale].pages[key];
    return {
      key,
      href: "/" + locale + "/services/" + page.slug,
      label: page.title,
    };
  });
}

export function getAllServiceSlugs() {
  return (Object.keys(dictionaries) as Locale[]).flatMap((locale) =>
    pageOrder.map((key) => ({ locale, slug: dictionaries[locale].pages[key].slug })),
  );
}
