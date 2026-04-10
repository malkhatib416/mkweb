import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';

const requireAuth = mock(async () => undefined);

type BlogRouteSummary = {
  id: string;
  locale: string;
  title: string;
};

const blogServiceState = {
  getAllCalls: [] as unknown[],
  createCalls: [] as unknown[],
  getByIdCalls: [] as Array<{ id: string; locale?: string }>,
  updateCalls: [] as Array<{ id: string; body: unknown }>,
  deleteCalls: [] as string[],
  getAllResult: {
    data: [] as BlogRouteSummary[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
  createResult: { data: { id: 'blog-1', locale: 'fr', title: 'Article' } },
  getByIdResult: { data: { id: 'blog-1', locale: 'fr', title: 'Article' } },
  updateResult: { data: { id: 'blog-1', locale: 'de', title: 'Artikel' } },
};

const refreshState = {
  calls: 0,
  result: {
    languageCount: 3,
    createdCount: 4,
    skippedCount: 1,
  },
};

type LanguageRouteSummary = {
  id: string;
  code: string;
  name: string;
};

const languageServiceState = {
  getAllCalls: [] as unknown[],
  createCalls: [] as unknown[],
  getByIdCalls: [] as string[],
  updateCalls: [] as Array<{ id: string; body: unknown }>,
  deleteCalls: [] as string[],
  getAllResult: {
    data: [] as LanguageRouteSummary[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
  createResult: { data: { id: 'language-es', code: 'es', name: 'Spanish' } },
  getByIdResult: { data: { id: 'language-es', code: 'es', name: 'Spanish' } },
  updateResult: { data: { id: 'language-es', code: 'es', name: 'Espagnol' } },
};

const blogServiceServer = {
  async getAll(params: unknown) {
    blogServiceState.getAllCalls.push(params);
    return blogServiceState.getAllResult;
  },
  async create(body: unknown) {
    blogServiceState.createCalls.push(body);
    return blogServiceState.createResult;
  },
  async getById(id: string, locale?: string) {
    blogServiceState.getByIdCalls.push({ id, locale });
    return blogServiceState.getByIdResult;
  },
  async update(id: string, body: unknown) {
    blogServiceState.updateCalls.push({ id, body });
    return blogServiceState.updateResult;
  },
  async delete(id: string) {
    blogServiceState.deleteCalls.push(id);
  },
};

const refreshBlogTranslationsForLanguages = mock(async () => {
  refreshState.calls += 1;
  return refreshState.result;
});

mock.module('@/lib/auth-utils', () => ({
  requireAuth,
}));

mock.module('@/lib/services/blog.service.server', () => ({
  blogServiceServer,
}));

mock.module('@/lib/services/language.service.server', () => ({
  getAllLanguages: async (params: unknown) => {
    languageServiceState.getAllCalls.push(params);
    return languageServiceState.getAllResult;
  },
  createLanguage: async (body: unknown) => {
    languageServiceState.createCalls.push(body);
    return languageServiceState.createResult;
  },
  getLanguageById: async (id: string) => {
    languageServiceState.getByIdCalls.push(id);
    return languageServiceState.getByIdResult;
  },
  updateLanguage: async (id: string, body: unknown) => {
    languageServiceState.updateCalls.push({ id, body });
    return languageServiceState.updateResult;
  },
  deleteLanguage: async (id: string) => {
    languageServiceState.deleteCalls.push(id);
  },
  refreshBlogTranslationsForLanguages,
}));

let collectionRoute: typeof import('@/app/api/admin/blogs/route');
let itemRoute: typeof import('@/app/api/admin/blogs/[id]/route');
let refreshRoute: typeof import('@/app/api/admin/blogs/refresh-translations/route');
let languageCollectionRoute: typeof import('@/app/api/admin/languages/route');
let languageItemRoute: typeof import('@/app/api/admin/languages/[id]/route');

describe('admin blog routes', () => {
  beforeAll(async () => {
    collectionRoute = await import('@/app/api/admin/blogs/route');
    itemRoute = await import('@/app/api/admin/blogs/[id]/route');
    refreshRoute =
      await import('@/app/api/admin/blogs/refresh-translations/route');
    languageCollectionRoute = await import('@/app/api/admin/languages/route');
    languageItemRoute = await import('@/app/api/admin/languages/[id]/route');
  });

  beforeEach(() => {
    requireAuth.mockClear();
    refreshBlogTranslationsForLanguages.mockClear();
    blogServiceState.getAllCalls = [];
    blogServiceState.createCalls = [];
    blogServiceState.getByIdCalls = [];
    blogServiceState.updateCalls = [];
    blogServiceState.deleteCalls = [];
    blogServiceState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    blogServiceState.createResult = {
      data: { id: 'blog-1', locale: 'fr', title: 'Article' },
    };
    blogServiceState.getByIdResult = {
      data: { id: 'blog-1', locale: 'fr', title: 'Article' },
    };
    blogServiceState.updateResult = {
      data: { id: 'blog-1', locale: 'de', title: 'Artikel' },
    };
    refreshState.calls = 0;
    refreshState.result = {
      languageCount: 3,
      createdCount: 4,
      skippedCount: 1,
    };
    languageServiceState.getAllCalls = [];
    languageServiceState.createCalls = [];
    languageServiceState.getByIdCalls = [];
    languageServiceState.updateCalls = [];
    languageServiceState.deleteCalls = [];
    languageServiceState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    languageServiceState.createResult = {
      data: { id: 'language-es', code: 'es', name: 'Spanish' },
    };
    languageServiceState.getByIdResult = {
      data: { id: 'language-es', code: 'es', name: 'Spanish' },
    };
    languageServiceState.updateResult = {
      data: { id: 'language-es', code: 'es', name: 'Espagnol' },
    };
  });

  it('lists blogs from query parameters', async () => {
    blogServiceState.getAllResult = {
      data: [{ id: 'blog-1', locale: 'de', title: 'Artikel' }],
      pagination: { page: 2, limit: 5, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/blogs?page=2&limit=5&status=published&locale=de&categoryId=cat-1',
    );

    const response = await collectionRoute.GET(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(blogServiceState.getAllCalls[0]).toEqual({
      page: 2,
      limit: 5,
      status: 'published',
      locale: 'de',
      categoryId: 'cat-1',
    });
    expect(response.status).toBe(200);
    expect(json).toEqual(blogServiceState.getAllResult);
  });

  it('creates a blog and returns 201', async () => {
    const body = {
      title: 'Nuovo articolo',
      slug: 'nuovo-articolo',
      locale: 'it',
      content: 'Contenuto',
      status: 'draft',
    };

    const request = new NextRequest('http://localhost/api/admin/blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await collectionRoute.POST(request);
    const json = await response.json();

    expect(blogServiceState.createCalls[0]).toEqual(body);
    expect(response.status).toBe(201);
    expect(json).toEqual(blogServiceState.createResult);
  });

  it('gets a single blog by id and locale', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/blogs/blog-1?locale=de',
    );

    const response = await itemRoute.GET(request, {
      params: Promise.resolve({ id: 'blog-1' }),
    });
    const json = await response.json();

    expect(blogServiceState.getByIdCalls).toEqual([
      { id: 'blog-1', locale: 'de' },
    ]);
    expect(response.status).toBe(200);
    expect(json).toEqual(blogServiceState.getByIdResult);
  });

  it('updates a blog by id', async () => {
    const body = {
      locale: 'de',
      title: 'Artikel',
      slug: 'artikel',
      content: 'Inhalt',
    };

    const request = new NextRequest('http://localhost/api/admin/blogs/blog-1', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await itemRoute.PUT(request, {
      params: Promise.resolve({ id: 'blog-1' }),
    });
    const json = await response.json();

    expect(blogServiceState.updateCalls).toEqual([{ id: 'blog-1', body }]);
    expect(response.status).toBe(200);
    expect(json).toEqual(blogServiceState.updateResult);
  });

  it('deletes a blog by id', async () => {
    const request = new NextRequest('http://localhost/api/admin/blogs/blog-1', {
      method: 'DELETE',
    });

    const response = await itemRoute.DELETE(request, {
      params: Promise.resolve({ id: 'blog-1' }),
    });
    const json = await response.json();

    expect(blogServiceState.deleteCalls).toEqual(['blog-1']);
    expect(response.status).toBe(200);
    expect(json).toEqual({ message: 'Blog deleted successfully' });
  });

  it('refreshes blog translations from the language table', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/blogs/refresh-translations',
      { method: 'POST' },
    );

    const response = await refreshRoute.POST(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(refreshBlogTranslationsForLanguages).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(200);
    expect(json).toEqual({ data: refreshState.result });
  });
});

describe('admin language routes', () => {
  beforeEach(() => {
    requireAuth.mockClear();
    languageServiceState.getAllCalls = [];
    languageServiceState.createCalls = [];
    languageServiceState.getByIdCalls = [];
    languageServiceState.updateCalls = [];
    languageServiceState.deleteCalls = [];
    languageServiceState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    languageServiceState.createResult = {
      data: { id: 'language-es', code: 'es', name: 'Spanish' },
    };
    languageServiceState.getByIdResult = {
      data: { id: 'language-es', code: 'es', name: 'Spanish' },
    };
    languageServiceState.updateResult = {
      data: { id: 'language-es', code: 'es', name: 'Espagnol' },
    };
  });

  it('lists languages from pagination query parameters', async () => {
    languageServiceState.getAllResult = {
      data: [{ id: 'language-es', code: 'es', name: 'Spanish' }],
      pagination: { page: 2, limit: 5, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/languages?page=2&limit=5',
    );

    const response = await languageCollectionRoute.GET(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(languageServiceState.getAllCalls[0]).toEqual({ page: 2, limit: 5 });
    expect(response.status).toBe(200);
    expect(json).toEqual(languageServiceState.getAllResult);
  });

  it('creates a language and returns 201', async () => {
    const body = { code: 'es', name: 'Spanish' };

    const request = new NextRequest('http://localhost/api/admin/languages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await languageCollectionRoute.POST(request);
    const json = await response.json();

    expect(languageServiceState.createCalls[0]).toEqual(body);
    expect(response.status).toBe(201);
    expect(json).toEqual(languageServiceState.createResult);
  });

  it('gets a single language by id', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/languages/language-es',
    );

    const response = await languageItemRoute.GET(request, {
      params: Promise.resolve({ id: 'language-es' }),
    });
    const json = await response.json();

    expect(languageServiceState.getByIdCalls).toEqual(['language-es']);
    expect(response.status).toBe(200);
    expect(json).toEqual(languageServiceState.getByIdResult);
  });

  it('updates a language by id', async () => {
    const body = { code: 'es', name: 'Espagnol' };

    const request = new NextRequest(
      'http://localhost/api/admin/languages/language-es',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    const response = await languageItemRoute.PUT(request, {
      params: Promise.resolve({ id: 'language-es' }),
    });
    const json = await response.json();

    expect(languageServiceState.updateCalls).toEqual([
      { id: 'language-es', body },
    ]);
    expect(response.status).toBe(200);
    expect(json).toEqual(languageServiceState.updateResult);
  });

  it('deletes a language by id', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/languages/language-es',
      {
        method: 'DELETE',
      },
    );

    const response = await languageItemRoute.DELETE(request, {
      params: Promise.resolve({ id: 'language-es' }),
    });
    const json = await response.json();

    expect(languageServiceState.deleteCalls).toEqual(['language-es']);
    expect(response.status).toBe(200);
    expect(json).toEqual({ message: 'Language deleted successfully' });
  });
});
