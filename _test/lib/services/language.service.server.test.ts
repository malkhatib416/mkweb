import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import type { Locale } from '@/locales/i18n';

type LanguageRow = {
  id: string;
  code: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};

type BlogRow = {
  id: string;
  image?: string | null;
  categoryId?: string | null;
};

type CategoryRow = {
  id: string;
};

type ProjectRow = {
  id: string;
};

type BlogTranslationRow = {
  id: string;
  entityType: 'blog';
  blogId: string;
  categoryId: null;
  projectId: null;
  locale: Locale;
  slug: string;
  title: string | null;
  description: string | null;
  content: string | null;
  name: null;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryTranslationRow = {
  id: string;
  entityType: 'category';
  blogId: null;
  categoryId: string;
  projectId: null;
  locale: Locale;
  slug: string;
  title: null;
  description: string | null;
  content: null;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type ProjectTranslationRow = {
  id: string;
  entityType: 'project';
  blogId: null;
  categoryId: null;
  projectId: string;
  locale: Locale;
  slug: string;
  title: string | null;
  description: string | null;
  content: string | null;
  name: null;
  createdAt: Date;
  updatedAt: Date;
};

type MockState = {
  languages: LanguageRow[];
  languageFindFirstQueue: Array<LanguageRow | null>;
  blogRowsQueue: BlogRow[][];
  categoryRowsQueue: CategoryRow[][];
  projectRowsQueue: ProjectRow[][];
  translationRowsQueue: Array<
    Array<BlogTranslationRow | CategoryTranslationRow | ProjectTranslationRow>
  >;
  translationFindFirstQueue: unknown[];
  insertReturningQueue: unknown[];
  insertCalls: Array<{ table: unknown; values: unknown }>;
  updateCalls: Array<{ table: unknown; values: unknown }>;
  deleteCalls: Array<{ table: unknown }>;
};

function createMockState(): MockState {
  return {
    languages: [],
    languageFindFirstQueue: [],
    blogRowsQueue: [],
    categoryRowsQueue: [],
    projectRowsQueue: [],
    translationRowsQueue: [],
    translationFindFirstQueue: [],
    insertReturningQueue: [],
    insertCalls: [],
    updateCalls: [],
    deleteCalls: [],
  };
}

let state = createMockState();

const languageTable = { name: 'language' };
const blogTable = { name: 'blog' };
const categoryTable = { name: 'category' };
const projectTable = { name: 'project' };
const translationTable = { name: 'translation' };

const db = {
  query: {
    language: {
      findMany: async () => state.languages,
      findFirst: async () => state.languageFindFirstQueue.shift() ?? null,
    },
    translation: {
      findFirst: async () => state.translationFindFirstQueue.shift() ?? null,
    },
  },
  select: () => ({
    from: (table: unknown) => {
      let consumed = false;

      const takeResult = () => {
        if (!consumed) {
          consumed = true;
          if (table === blogTable) {
            return state.blogRowsQueue.shift() ?? [];
          }

          if (table === categoryTable) {
            return state.categoryRowsQueue.shift() ?? [];
          }

          if (table === projectTable) {
            return state.projectRowsQueue.shift() ?? [];
          }

          if (table === translationTable) {
            return state.translationRowsQueue.shift() ?? [];
          }

          return [];
        }

        return [];
      };

      return {
        where: async () => takeResult(),
        then: (resolve, reject) =>
          Promise.resolve(takeResult()).then(resolve, reject),
      };
    },
  }),
  insert: (table: unknown) => ({
    values: (values: unknown) => {
      state.insertCalls.push({ table, values });

      return {
        returning: async () => [state.insertReturningQueue.shift()],
        then: (resolve, reject) => Promise.resolve([]).then(resolve, reject),
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
  delete: (table: unknown) => ({
    where: async () => {
      state.deleteCalls.push({ table });
      return [];
    },
  }),
};

const translateBlogContent = mock(
  async (input: { targetLanguageCode: string; title: string }) => ({
    title: `${input.title} ${input.targetLanguageCode}`,
    slug: `${input.targetLanguageCode}-${input.title
      .toLowerCase()
      .replace(/\s+/g, '-')}`,
    description: `Description ${input.targetLanguageCode}`,
    content: `Content ${input.targetLanguageCode}`,
  }),
);

const translateCategoryContent = mock(async () => ({
  name: 'Category',
  slug: 'category',
  description: null,
}));

const translateProjectContent = mock(
  async (input: { targetLanguageCode: string; title: string }) => ({
    title: `${input.title} ${input.targetLanguageCode}`,
    slug: `${input.targetLanguageCode}-${input.title
      .toLowerCase()
      .replace(/\s+/g, '-')}`,
    description: `Project description ${input.targetLanguageCode}`,
    content: `Project content ${input.targetLanguageCode}`,
  }),
);

const suggestArticleTopics = mock(async () => ({ topics: [] }));

mock.module('@/db', () => ({ db }));
mock.module('@/db/schema', () => ({
  language: languageTable,
  blog: blogTable,
  category: categoryTable,
  project: projectTable,
  translation: translationTable,
}));
mock.module('@/lib/services/ai.service.server', () => ({
  translateBlogContent,
  translateCategoryContent,
  translateProjectContent,
  suggestArticleTopics,
}));

let refreshBlogTranslationsForLanguages: typeof import('../../../lib/services/language.service.server').refreshBlogTranslationsForLanguages;
let createLanguage: typeof import('../../../lib/services/language.service.server').createLanguage;

function createLanguageRow(code: string, name: string): LanguageRow {
  return {
    id: `language-${code}`,
    code,
    name,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
  };
}

function createBlogTranslationRow(
  blogId: string,
  locale: Locale,
  overrides: Partial<BlogTranslationRow> = {},
): BlogTranslationRow {
  return {
    id: `${blogId}-${locale}`,
    entityType: 'blog',
    blogId,
    categoryId: null,
    projectId: null,
    locale,
    slug: `${blogId}-${locale}`,
    title: `Title ${locale}`,
    description: `Description ${locale}`,
    content: `Content ${locale}`,
    name: null,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

function createCategoryTranslationRow(
  categoryId: string,
  locale: Locale,
  overrides: Partial<CategoryTranslationRow> = {},
): CategoryTranslationRow {
  return {
    id: `${categoryId}-${locale}`,
    entityType: 'category',
    blogId: null,
    categoryId,
    projectId: null,
    locale,
    slug: `${categoryId}-${locale}`,
    title: null,
    description: `Description ${locale}`,
    content: null,
    name: `Category ${locale}`,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

function createProjectTranslationRow(
  projectId: string,
  locale: Locale,
  overrides: Partial<ProjectTranslationRow> = {},
): ProjectTranslationRow {
  return {
    id: `${projectId}-${locale}`,
    entityType: 'project',
    blogId: null,
    categoryId: null,
    projectId,
    locale,
    slug: `${projectId}-${locale}`,
    title: `Project ${locale}`,
    description: `Project description ${locale}`,
    content: `Project content ${locale}`,
    name: null,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

describe('refreshBlogTranslationsForLanguages', () => {
  beforeAll(async () => {
    ({ refreshBlogTranslationsForLanguages, createLanguage } =
      await import('../../../lib/services/language.service.server'));
  });

  beforeEach(() => {
    state = createMockState();
    translateBlogContent.mockClear();
    translateCategoryContent.mockClear();
    translateProjectContent.mockClear();
  });

  it('creates missing blog translations for every language in the language table', async () => {
    state.languages = [
      createLanguageRow('fr', 'French'),
      createLanguageRow('en', 'English'),
      createLanguageRow('de', 'German'),
    ];
    state.blogRowsQueue.push(
      [{ id: 'blog-1' }, { id: 'blog-2' }],
      [{ id: 'blog-1' }, { id: 'blog-2' }],
      [{ id: 'blog-1' }, { id: 'blog-2' }],
    );
    state.translationRowsQueue.push(
      [
        createBlogTranslationRow('blog-1', 'fr'),
        createBlogTranslationRow('blog-2', 'fr'),
        createBlogTranslationRow('blog-2', 'en'),
      ],
      [
        createBlogTranslationRow('blog-1', 'fr'),
        createBlogTranslationRow('blog-2', 'fr'),
        createBlogTranslationRow('blog-2', 'en'),
      ],
      [
        createBlogTranslationRow('blog-1', 'fr'),
        createBlogTranslationRow('blog-2', 'fr'),
        createBlogTranslationRow('blog-2', 'en'),
      ],
    );
    state.translationFindFirstQueue.push(null, null, null);

    const result = await refreshBlogTranslationsForLanguages();

    expect(result).toEqual({
      languageCount: 3,
      createdCount: 3,
      skippedCount: 0,
    });
    expect(translateBlogContent).toHaveBeenCalledTimes(3);
    expect(state.insertCalls).toHaveLength(3);
    expect(state.insertCalls[0]?.table).toBe(translationTable);
    expect(state.insertCalls[0]?.values).toMatchObject({
      entityType: 'blog',
      blogId: 'blog-1',
      locale: 'en',
    });
    expect(state.insertCalls[1]?.values).toMatchObject({
      entityType: 'blog',
      blogId: 'blog-1',
      locale: 'de',
    });
    expect(state.insertCalls[2]?.values).toMatchObject({
      entityType: 'blog',
      blogId: 'blog-2',
      locale: 'de',
    });
    expect(state.updateCalls).toHaveLength(3);
    expect(state.updateCalls.every((call) => call.table === blogTable)).toBe(
      true,
    );
  });

  it('skips blogs that have no usable source translation', async () => {
    state.languages = [createLanguageRow('de', 'German')];
    state.blogRowsQueue.push([{ id: 'blog-1' }]);
    state.translationRowsQueue.push([
      createBlogTranslationRow('blog-1', 'fr', {
        title: null,
        content: null,
      }),
    ]);

    const result = await refreshBlogTranslationsForLanguages();

    expect(result).toEqual({
      languageCount: 1,
      createdCount: 0,
      skippedCount: 1,
    });
    expect(translateBlogContent).not.toHaveBeenCalled();
    expect(state.insertCalls).toHaveLength(0);
    expect(state.updateCalls).toHaveLength(0);
  });

  it('skips likely migrated sibling blogs when a default-locale source already exists for the same article metadata', async () => {
    state.languages = [createLanguageRow('de', 'German')];
    state.blogRowsQueue.push([
      { id: 'blog-fr', image: '/shared-cover.png', categoryId: 'category-1' },
      { id: 'blog-en', image: '/shared-cover.png', categoryId: 'category-1' },
    ]);
    state.translationRowsQueue.push([
      createBlogTranslationRow('blog-fr', 'fr', {
        slug: 'guide-seo-debutant',
        title: 'Guide SEO',
        content: 'Contenu FR',
      }),
      createBlogTranslationRow('blog-en', 'en', {
        slug: 'seo-beginner-guide',
        title: 'SEO Guide',
        content: 'Content EN',
      }),
    ]);
    state.translationFindFirstQueue.push(null);

    const result = await refreshBlogTranslationsForLanguages();

    expect(result).toEqual({
      languageCount: 1,
      createdCount: 1,
      skippedCount: 1,
    });
    expect(translateBlogContent).toHaveBeenCalledTimes(1);
    expect(state.insertCalls).toHaveLength(1);
    expect(state.insertCalls[0]?.values).toMatchObject({
      entityType: 'blog',
      blogId: 'blog-fr',
      locale: 'de',
    });
  });

  it('returns zero counts when there are no configured languages', async () => {
    state.languages = [];

    const result = await refreshBlogTranslationsForLanguages();

    expect(result).toEqual({
      languageCount: 0,
      createdCount: 0,
      skippedCount: 0,
    });
    expect(translateBlogContent).not.toHaveBeenCalled();
  });
});

describe('createLanguage', () => {
  beforeEach(() => {
    state = createMockState();
    translateBlogContent.mockClear();
    translateCategoryContent.mockClear();
    translateProjectContent.mockClear();
  });

  it('backfills blog, category, and project translations for the new language', async () => {
    const createdLanguage = createLanguageRow('es', 'Spanish');

    state.languageFindFirstQueue.push(null);
    state.insertReturningQueue.push(createdLanguage);
    state.blogRowsQueue.push([{ id: 'blog-1' }]);
    state.categoryRowsQueue.push([{ id: 'category-1' }]);
    state.projectRowsQueue.push([{ id: 'project-1' }]);
    state.translationRowsQueue.push(
      [createBlogTranslationRow('blog-1', 'fr')],
      [createCategoryTranslationRow('category-1', 'fr')],
      [createProjectTranslationRow('project-1', 'fr')],
    );
    state.translationFindFirstQueue.push(null, null, null);

    const result = await createLanguage({ code: 'es', name: 'Spanish' });

    expect(result).toEqual({ data: createdLanguage });
    expect(state.insertCalls[0]?.table).toBe(languageTable);
    expect(state.insertCalls[1]?.values).toMatchObject({
      entityType: 'blog',
      blogId: 'blog-1',
      locale: 'es',
    });
    expect(state.insertCalls[2]?.values).toMatchObject({
      entityType: 'category',
      categoryId: 'category-1',
      locale: 'es',
    });
    expect(state.insertCalls[3]?.values).toMatchObject({
      entityType: 'project',
      projectId: 'project-1',
      locale: 'es',
    });
    expect(translateBlogContent).toHaveBeenCalledTimes(1);
    expect(translateCategoryContent).toHaveBeenCalledTimes(1);
    expect(translateProjectContent).toHaveBeenCalledTimes(1);
    expect(state.updateCalls).toHaveLength(3);
    expect(state.updateCalls.some((call) => call.table === blogTable)).toBe(
      true,
    );
    expect(state.updateCalls.some((call) => call.table === categoryTable)).toBe(
      true,
    );
    expect(state.updateCalls.some((call) => call.table === projectTable)).toBe(
      true,
    );
  });

  it('rolls back the created language when one of the backfills fails', async () => {
    const createdLanguage = createLanguageRow('es', 'Spanish');

    state.languageFindFirstQueue.push(null);
    state.insertReturningQueue.push(createdLanguage);
    state.blogRowsQueue.push([{ id: 'blog-1' }]);
    state.categoryRowsQueue.push([{ id: 'category-1' }]);
    state.projectRowsQueue.push([{ id: 'project-1' }]);
    state.translationRowsQueue.push(
      [createBlogTranslationRow('blog-1', 'fr')],
      [createCategoryTranslationRow('category-1', 'fr')],
      [createProjectTranslationRow('project-1', 'fr')],
    );
    state.translationFindFirstQueue.push(null, null, null);
    translateProjectContent.mockImplementationOnce(async () => {
      throw new Error('project translation failed');
    });

    await expect(
      createLanguage({ code: 'es', name: 'Spanish' }),
    ).rejects.toThrow('project translation failed');

    expect(state.deleteCalls).toHaveLength(2);
    expect(state.deleteCalls[0]?.table).toBe(translationTable);
    expect(state.deleteCalls[1]?.table).toBe(languageTable);
  });
});
