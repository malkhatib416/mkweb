import { project } from "@/db/schema";
import { defaultLocale } from "@/locales/i18n";
import type { Locale, Project, ProjectTranslation } from "@/types/entities";

export function pickProjectTranslation(
  translations: readonly ProjectTranslation[],
  locale?: Locale
): ProjectTranslation | null {
  if (locale) {
    const exact = translations.find((item) => item.locale === locale);
    if (exact) return exact;
  }

  return (
    translations.find((item) => item.locale === defaultLocale) ??
    translations[0] ??
    null
  );
}

export function groupProjectTranslationsByProjectId(
  translations: readonly ProjectTranslation[]
): Map<string, ProjectTranslation[]> {
  const translationMap = new Map<string, ProjectTranslation[]>();

  for (const item of translations) {
    if (!item.projectId) continue;
    const list = translationMap.get(item.projectId) ?? [];
    list.push(item);
    translationMap.set(item.projectId, list);
  }

  return translationMap;
}

export function mapProjectFromTranslations(
  parent: typeof project.$inferSelect,
  translations: readonly ProjectTranslation[],
  locale?: Locale
): Project {
  const current = pickProjectTranslation(translations, locale);
  if (!current?.title || !current.content) {
    throw new Error("Project translation not found");
  }

  return {
    ...parent,
    locale: current.locale,
    title: current.title,
    slug: current.slug,
    description: current.description ?? null,
    content: current.content,
    translations: [...translations],
  };
}

export function buildProjectSummaryMap(
  translations: readonly ProjectTranslation[],
  locale: Locale = defaultLocale
): Map<string, { title: string; slug: string }> {
  const grouped = groupProjectTranslationsByProjectId(translations);
  const result = new Map<string, { title: string; slug: string }>();

  grouped.forEach((items, projectId) => {
    const selected = pickProjectTranslation(items, locale);
    if (!selected?.title) return;

    result.set(projectId, {
      title: selected.title,
      slug: selected.slug,
    });
  });

  return result;
}
