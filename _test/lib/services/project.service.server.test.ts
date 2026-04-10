import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import type { Locale } from '@/locales/i18n';

type ProjectRow = {
  id: string;
  status: 'draft' | 'published';
  clientId: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectTranslationRow = {
  id: string;
  entityType: 'project';
  projectId: string;
  locale: Locale;
  slug: string;
  title: string | null;
  description: string | null;
  content: string | null;
  name: null;
  categoryId: null;
  blogId: null;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectWithTranslations = ProjectRow & {
  translations: ProjectTranslationRow[];
};

type MockState = {
  projectFindFirstQueue: Array<ProjectRow | ProjectWithTranslations | null>;
  projectFindManyQueue: Array<Array<ProjectWithTranslations>>;
  translationFindFirstQueue: Array<unknown>;
  translationFindManyQueue: Array<
    Array<{ project: ProjectWithTranslations | null }>
  >;
  insertReturningQueue: unknown[];
  selectQueue: Array<Array<{ count: number }>>;
  insertCalls: Array<{ table: unknown; values: unknown }>;
  updateCalls: Array<{ table: unknown; values: unknown }>;
};

function createMockState(): MockState {
  return {
    projectFindFirstQueue: [],
    projectFindManyQueue: [],
    translationFindFirstQueue: [],
    translationFindManyQueue: [],
    insertReturningQueue: [],
    selectQueue: [],
    insertCalls: [],
    updateCalls: [],
  };
}

let state = createMockState();

const blogTable = { name: 'blog' };
const categoryTable = { name: 'category' };
const languageTable = { name: 'language' };
const projectTable = { name: 'project' };
const translationTable = { name: 'translation' };

const db = {
  query: {
    project: {
      findFirst: async () => state.projectFindFirstQueue.shift() ?? null,
      findMany: async () => state.projectFindManyQueue.shift() ?? [],
    },
    translation: {
      findFirst: async () => state.translationFindFirstQueue.shift() ?? null,
      findMany: async () => state.translationFindManyQueue.shift() ?? [],
    },
  },
  insert: (table: unknown) => ({
    values: (values: unknown) => {
      state.insertCalls.push({ table, values });

      return {
        returning: async () => [state.insertReturningQueue.shift()],
      };
    },
  }),
  update: (table: unknown) => ({
    set: (values: unknown) => ({
      where: async () => {
        state.updateCalls.push({ table, values });
        return [];
      },
    }),
  }),
  select: () => ({
    from: () => ({
      where: async () => state.selectQueue.shift() ?? [{ count: 0 }],
    }),
  }),
};

mock.module('@/db', () => ({ db }));
mock.module('@/db/schema', () => ({
  blog: blogTable,
  category: categoryTable,
  language: languageTable,
  project: projectTable,
  translation: translationTable,
}));

let projectServiceServer: typeof import('@/lib/services/project.service.server').projectServiceServer;

function createProjectRow(overrides: Partial<ProjectRow> = {}): ProjectRow {
  return {
    id: 'project-1',
    status: 'draft',
    clientId: null,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

function createProjectTranslationRow(
  locale: Locale,
  overrides: Partial<ProjectTranslationRow> = {},
): ProjectTranslationRow {
  return {
    id: `translation-${locale}`,
    entityType: 'project',
    projectId: 'project-1',
    locale,
    slug: `slug-${locale}`,
    title: `Title ${locale}`,
    description: `Description ${locale}`,
    content: `Content ${locale}`,
    name: null,
    categoryId: null,
    blogId: null,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

function createProjectWithTranslations(
  translations: ProjectTranslationRow[],
  overrides: Partial<ProjectRow> = {},
): ProjectWithTranslations {
  return {
    ...createProjectRow(overrides),
    translations,
  };
}

describe('projectServiceServer', () => {
  beforeAll(async () => {
    ({ projectServiceServer } =
      await import('@/lib/services/project.service.server'));
  });

  beforeEach(() => {
    state = createMockState();
  });

  it('returns a blank translation shell when a requested locale is missing', async () => {
    state.projectFindFirstQueue.push(
      createProjectWithTranslations([createProjectTranslationRow('fr')]),
    );

    const result = await projectServiceServer.getById('project-1', 'de');

    expect(result.data.locale).toBe('de');
    expect(result.data.title).toBe('');
    expect(result.data.slug).toBe('');
    expect(result.data.content).toBe('');
    expect(result.data.translations).toHaveLength(1);
  });

  it('creates a project and its first translation', async () => {
    state.translationFindFirstQueue.push(null);
    state.insertReturningQueue.push(createProjectRow());
    state.projectFindFirstQueue.push(
      createProjectWithTranslations([createProjectTranslationRow('it')]),
    );

    const result = await projectServiceServer.create({
      title: 'Titolo',
      slug: 'titolo',
      locale: 'it',
      description: 'Descrizione',
      content: 'Contenuto',
      status: 'draft',
      clientId: null,
    });

    expect(state.insertCalls).toHaveLength(2);
    expect(state.insertCalls[0]?.table).toBe(projectTable);
    expect(state.insertCalls[1]?.table).toBe(translationTable);
    expect(state.insertCalls[1]?.values).toMatchObject({
      entityType: 'project',
      projectId: 'project-1',
      locale: 'it',
      slug: 'titolo',
      title: 'Titolo',
      description: 'Descrizione',
      content: 'Contenuto',
    });
    expect(result.data.locale).toBe('it');
    expect(result.data.title).toBe('Title it');
  });

  it('adds a new translation during update when the locale does not exist yet', async () => {
    state.projectFindFirstQueue.push(
      createProjectRow(),
      createProjectWithTranslations([createProjectTranslationRow('fr')]),
      createProjectWithTranslations([
        createProjectTranslationRow('fr'),
        createProjectTranslationRow('de', {
          slug: 'hallo-welt',
          title: 'Hallo Welt',
          description: 'Neue Beschreibung',
          content: 'Neuer Inhalt',
        }),
      ]),
    );
    state.translationFindFirstQueue.push(null);

    const result = await projectServiceServer.update('project-1', {
      locale: 'de',
      title: 'Hallo Welt',
      slug: 'hallo-welt',
      description: 'Neue Beschreibung',
      content: 'Neuer Inhalt',
      status: 'published',
    });

    expect(state.insertCalls).toHaveLength(1);
    expect(state.insertCalls[0]?.table).toBe(translationTable);
    expect(state.insertCalls[0]?.values).toMatchObject({
      entityType: 'project',
      projectId: 'project-1',
      locale: 'de',
      slug: 'hallo-welt',
      title: 'Hallo Welt',
      description: 'Neue Beschreibung',
      content: 'Neuer Inhalt',
    });
    expect(state.updateCalls).toHaveLength(1);
    expect(state.updateCalls[0]?.table).toBe(projectTable);
    expect(state.updateCalls[0]?.values).toMatchObject({ status: 'published' });
    expect(result.data.locale).toBe('de');
    expect(result.data.slug).toBe('hallo-welt');
  });

  it('returns a published localized project by slug', async () => {
    state.translationFindFirstQueue.push({
      project: createProjectWithTranslations(
        [
          createProjectTranslationRow('fr', {
            slug: 'bonjour',
            title: 'Bonjour',
          }),
          createProjectTranslationRow('es', {
            slug: 'hola',
            title: 'Hola',
            description: 'Descripcion',
            content: 'Contenido',
          }),
        ],
        { status: 'published' },
      ),
    });

    const result = await projectServiceServer.getPublishedBySlug('hola', 'es');

    expect(result).not.toBeNull();
    expect(result?.locale).toBe('es');
    expect(result?.title).toBe('Hola');
    expect(result?.status).toBe('published');
  });
});
