import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import type { Locale } from '@/locales/i18n';

type BlogRow = {
  id: string;
  image: string | null;
  status: 'draft' | 'published';
  categoryId: string | null;
  readingTime: number | null;
  createdAt: Date;
  updatedAt: Date;
};

type BlogTranslationRow = {
  id: string;
  entityType: 'blog';
  locale: Locale;
  blogId: string;
  categoryId: null;
  projectId?: null;
  slug: string;
  title: string | null;
  description: string | null;
  content: string | null;
  name: null;
  createdAt: Date;
  updatedAt: Date;
};

type MockState = {
  blogFindFirstQueue: Array<BlogRow | null>;
  translationFindFirstQueue: Array<unknown>;
  selectWhereQueue: unknown[];
  insertReturningQueue: unknown[];
  insertCalls: Array<{ table: unknown; values: unknown }>;
  updateCalls: Array<{ table: unknown; values: unknown }>;
};

function createMockState(): MockState {
  return {
    blogFindFirstQueue: [],
    translationFindFirstQueue: [],
    selectWhereQueue: [],
    insertReturningQueue: [],
    insertCalls: [],
    updateCalls: [],
  };
}

let state = createMockState();

const blogTable = { name: 'blog', id: 'blog.id' };
const categoryTable = { name: 'category', id: 'category.id' };
const clientTable = { name: 'client', id: 'client.id' };
const languageTable = { name: 'language', code: 'language.code' };
const newsletterSubscriberTable = {
  name: 'newsletterSubscriber',
  id: 'newsletter.id',
};
const projectTable = { name: 'project', id: 'project.id' };
const projectReviewTable = { name: 'projectReview', id: 'review.id' };
const translationTable = {
  name: 'translation',
  id: 'translation.id',
  entityType: 'translation.entityType',
  blogId: 'translation.blogId',
  categoryId: 'translation.categoryId',
  projectId: 'translation.projectId',
  locale: 'translation.locale',
  slug: 'translation.slug',
};

const db = {
  query: {
    blog: {
      findFirst: async () => state.blogFindFirstQueue.shift() ?? null,
    },
    translation: {
      findFirst: async () => state.translationFindFirstQueue.shift() ?? null,
    },
  },
  select: () => ({
    from: () => ({
      where: async () => state.selectWhereQueue.shift() ?? [],
    }),
  }),
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
};

mock.module('@/db', () => ({ db }));
mock.module('@/db/schema', () => ({
  blog: blogTable,
  category: categoryTable,
  client: clientTable,
  language: languageTable,
  newsletterSubscriber: newsletterSubscriberTable,
  project: projectTable,
  projectReview: projectReviewTable,
  translation: translationTable,
}));

let blogServiceServer: typeof import('@/lib/services/blog.service.server').blogServiceServer;

function createBlogRow(overrides: Partial<BlogRow> = {}): BlogRow {
  return {
    id: 'blog-1',
    image: null,
    status: 'draft',
    categoryId: null,
    readingTime: 5,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

function createBlogTranslationRow(
  locale: Locale,
  overrides: Partial<BlogTranslationRow> = {},
): BlogTranslationRow {
  return {
    id: `translation-${locale}`,
    entityType: 'blog',
    locale,
    blogId: 'blog-1',
    categoryId: null,
    projectId: null,
    slug: `slug-${locale}`,
    title: `Title ${locale}`,
    description: `Description ${locale}`,
    content: `Content ${locale}`,
    name: null,
    createdAt: new Date('2026-04-10T10:00:00.000Z'),
    updatedAt: new Date('2026-04-10T10:00:00.000Z'),
    ...overrides,
  };
}

describe('blogServiceServer', () => {
  beforeAll(async () => {
    ({ blogServiceServer } =
      await import('@/lib/services/blog.service.server'));
  });

  beforeEach(() => {
    state = createMockState();
  });

  it('returns a blank translation shell when a requested locale is missing', async () => {
    state.blogFindFirstQueue.push(createBlogRow());
    state.selectWhereQueue.push([]);

    const result = await blogServiceServer.getById('blog-1', 'de');

    expect(result.data.locale).toBe('de');
    expect(result.data.title).toBe('');
    expect(result.data.slug).toBe('');
    expect(result.data.content).toBe('');
    expect(result.data.translations).toHaveLength(0);
  });

  it('creates a blog and its first translation', async () => {
    state.translationFindFirstQueue.push(null);
    state.insertReturningQueue.push(createBlogRow());
    state.blogFindFirstQueue.push(createBlogRow());
    state.selectWhereQueue.push([
      createBlogTranslationRow('it', {
        slug: 'titolo',
        title: 'Titolo',
        description: 'Descrizione',
        content: 'Contenuto',
      }),
    ]);

    const result = await blogServiceServer.create({
      title: 'Titolo',
      slug: 'titolo',
      locale: 'it',
      description: 'Descrizione',
      image: '',
      content: 'Contenuto',
      status: 'draft',
      categoryId: null,
      readingTime: 6,
    });

    expect(state.insertCalls).toHaveLength(2);
    expect(state.insertCalls[0]?.table).toBe(blogTable);
    expect(state.insertCalls[1]?.table).toBe(translationTable);
    expect(state.insertCalls[1]?.values).toMatchObject({
      entityType: 'blog',
      blogId: 'blog-1',
      locale: 'it',
      slug: 'titolo',
      title: 'Titolo',
      description: 'Descrizione',
      content: 'Contenuto',
    });
    expect(result.data.locale).toBe('it');
    expect(result.data.title).toBe('Titolo');
  });

  it('adds a new translation during update when the locale does not exist yet', async () => {
    state.blogFindFirstQueue.push(createBlogRow(), createBlogRow());
    state.selectWhereQueue.push(
      [createBlogTranslationRow('fr')],
      [
        createBlogTranslationRow('fr'),
        createBlogTranslationRow('de', {
          slug: 'hallo-welt',
          title: 'Hallo Welt',
          description: 'Neue Beschreibung',
          content: 'Neuer Inhalt',
        }),
      ],
    );
    state.translationFindFirstQueue.push(null);

    const result = await blogServiceServer.update('blog-1', {
      locale: 'de',
      title: 'Hallo Welt',
      slug: 'hallo-welt',
      description: 'Neue Beschreibung',
      content: 'Neuer Inhalt',
      status: 'published',
      readingTime: 7,
    });

    expect(state.insertCalls).toHaveLength(1);
    expect(state.insertCalls[0]?.table).toBe(translationTable);
    expect(state.insertCalls[0]?.values).toMatchObject({
      entityType: 'blog',
      blogId: 'blog-1',
      locale: 'de',
      slug: 'hallo-welt',
      title: 'Hallo Welt',
      description: 'Neue Beschreibung',
      content: 'Neuer Inhalt',
    });
    expect(state.updateCalls).toHaveLength(1);
    expect(state.updateCalls[0]?.table).toBe(blogTable);
    expect(state.updateCalls[0]?.values).toMatchObject({
      status: 'published',
      readingTime: 7,
    });
    expect(result.data.locale).toBe('de');
    expect(result.data.slug).toBe('hallo-welt');
  });

  it('returns a localized blog by slug', async () => {
    state.translationFindFirstQueue.push({ blogId: 'blog-1' });
    state.blogFindFirstQueue.push(createBlogRow({ status: 'published' }));
    state.selectWhereQueue.push([
      createBlogTranslationRow('fr', { slug: 'bonjour', title: 'Bonjour' }),
      createBlogTranslationRow('es', {
        slug: 'hola',
        title: 'Hola',
        description: 'Descripcion',
        content: 'Contenido',
      }),
    ]);

    const result = await blogServiceServer.getBySlug('hola', 'es');

    expect(result.data.locale).toBe('es');
    expect(result.data.title).toBe('Hola');
    expect(result.data.status).toBe('published');
  });
});
