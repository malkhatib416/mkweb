import { describe, expect, test } from 'bun:test';
import {
  buildProjectSummaryMap,
  groupProjectTranslationsByProjectId,
  mapProjectFromTranslations,
  pickProjectTranslation,
} from '@/lib/services/project-translations';
import type { ProjectBase, ProjectTranslation } from '@/types/entities';

function createProjectBase(overrides: Partial<ProjectBase> = {}): ProjectBase {
  return {
    id: 'project-1',
    status: 'draft',
    clientId: null,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

function createProjectTranslation(
  overrides: Partial<ProjectTranslation> = {},
): ProjectTranslation {
  return {
    id: 'translation-1',
    entityType: 'project',
    locale: 'fr',
    blogId: null,
    categoryId: null,
    projectId: 'project-1',
    slug: 'slug-fr',
    title: 'Titre FR',
    name: null,
    description: 'Description FR',
    content: 'Contenu FR',
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

describe('project-translations helpers', () => {
  test('pickProjectTranslation returns exact locale when present', () => {
    const translations = [
      createProjectTranslation(),
      createProjectTranslation({
        id: 'translation-2',
        locale: 'en',
        slug: 'slug-en',
        title: 'Title EN',
        description: 'Description EN',
        content: 'Content EN',
      }),
    ];

    const result = pickProjectTranslation(translations, 'en');

    expect(result?.locale).toBe('en');
    expect(result?.title).toBe('Title EN');
  });

  test('pickProjectTranslation falls back to fr when requested locale is missing', () => {
    const translations = [
      createProjectTranslation({ locale: 'fr', title: 'Titre FR' }),
      createProjectTranslation({
        id: 'translation-2',
        locale: 'de',
        title: 'Titel DE',
        slug: 'slug-de',
        content: 'Inhalt DE',
      }),
    ];

    const result = pickProjectTranslation(translations, 'es');

    expect(result?.locale).toBe('fr');
    expect(result?.title).toBe('Titre FR');
  });

  test('groupProjectTranslationsByProjectId groups translations by project id', () => {
    const translations = [
      createProjectTranslation({ projectId: 'project-1' }),
      createProjectTranslation({
        id: 'translation-2',
        projectId: 'project-1',
        locale: 'en',
      }),
      createProjectTranslation({
        id: 'translation-3',
        projectId: 'project-2',
      }),
    ];

    const grouped = groupProjectTranslationsByProjectId(translations);

    expect(grouped.get('project-1')).toHaveLength(2);
    expect(grouped.get('project-2')).toHaveLength(1);
  });

  test('mapProjectFromTranslations projects localized fields onto the parent row', () => {
    const parent = createProjectBase({ id: 'project-1', status: 'published' });
    const translations = [
      createProjectTranslation(),
      createProjectTranslation({
        id: 'translation-2',
        locale: 'it',
        slug: 'slug-it',
        title: 'Titolo IT',
        description: 'Descrizione IT',
        content: 'Contenuto IT',
      }),
    ];

    const project = mapProjectFromTranslations(parent, translations, 'it');

    expect(project.id).toBe('project-1');
    expect(project.status).toBe('published');
    expect(project.locale).toBe('it');
    expect(project.slug).toBe('slug-it');
    expect(project.title).toBe('Titolo IT');
    expect(project.content).toBe('Contenuto IT');
    expect(project.translations).toHaveLength(2);
  });

  test('buildProjectSummaryMap returns default-locale summaries per project', () => {
    const translations = [
      createProjectTranslation({ projectId: 'project-1', locale: 'fr' }),
      createProjectTranslation({
        id: 'translation-2',
        projectId: 'project-1',
        locale: 'en',
        title: 'Title EN',
        slug: 'slug-en',
        content: 'Content EN',
      }),
      createProjectTranslation({
        id: 'translation-3',
        projectId: 'project-2',
        locale: 'de',
        title: 'Titel DE',
        slug: 'slug-de',
        content: 'Inhalt DE',
      }),
    ];

    const summaryMap = buildProjectSummaryMap(translations, 'fr');

    expect(summaryMap.get('project-1')).toEqual({
      title: 'Titre FR',
      slug: 'slug-fr',
    });
    expect(summaryMap.get('project-2')).toEqual({
      title: 'Titel DE',
      slug: 'slug-de',
    });
  });
});
