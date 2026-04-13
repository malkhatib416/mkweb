import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  mock,
} from 'bun:test';
import { NextRequest } from 'next/server';

const requireAuth = mock(async () => undefined);

const blogState = {
  getAllCalls: [] as unknown[],
  getAllResultByLocale: new Map<
    string,
    { data: unknown[]; pagination: unknown }
  >(),
};

const projectState = {
  getAllCalls: [] as unknown[],
  getAllResult: {
    data: [] as unknown[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
};

const reviewState = {
  getAllCalls: [] as unknown[],
  createCalls: [] as Array<{ data: unknown; expiryDays?: number }>,
  getAllResult: {
    data: [] as unknown[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
  createResult: { data: { id: 'review-1', token: 'abc123' } },
};

const newsletterState = {
  getAllCalls: [] as unknown[],
  getAllResult: {
    data: [] as unknown[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
};

const categoryState = {
  getAllCalls: [] as unknown[],
  getAllResult: {
    data: [] as Array<{ id: string; name: string }>,
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
};

const aiState = {
  suggestCalls: [] as unknown[],
  suggestResult: {
    topics: ['Topic 1', 'Topic 2'],
    categorySuggestions: ['SEO local', 'Refonte'],
  },
};

const dictionaryState = {
  calls: [] as string[],
  result: {
    admin: { common: { title: 'Admin' } },
    services: {
      website: { title: 'Website' },
      ecommerce: { title: 'E-commerce' },
      redesign: { title: 'Redesign' },
      maintenance: { title: 'Maintenance' },
      innovation: { title: 'Innovation' },
      mobileapp: { title: 'Mobile App' },
    },
  },
};

const storageState = {
  client: {} as object | null,
  ensureBucketCalls: 0,
  ensureBucketResult: true,
  uploadCalls: [] as Array<{ key: string; contentType: string; size: number }>,
  uploadResult: {
    key: 'uploads/file.png',
    url: 'https://cdn.test/uploads/file.png',
  } as { key: string; url: string } | null,
};

mock.module('@/lib/auth-utils', () => ({
  requireAuth,
}));

mock.module('@/lib/services/blog.service.server', () => ({
  blogServiceServer: {
    getAll: async (params: { locale?: string }) => {
      blogState.getAllCalls.push(params);
      const locale = params.locale ?? 'fr';
      return (
        blogState.getAllResultByLocale.get(locale) ?? {
          data: [],
          pagination: { page: 1, limit: 10, total: 0, pages: 1 },
        }
      );
    },
    create: async () => ({ data: null }),
    getById: async () => ({ data: null }),
    update: async () => ({ data: null }),
    delete: async () => undefined,
  },
}));

mock.module('@/lib/services/project.service.server', () => ({
  projectServiceServer: {
    getAll: async (params: unknown) => {
      projectState.getAllCalls.push(params);
      return projectState.getAllResult;
    },
    create: async () => ({ data: null }),
    getById: async () => ({ data: null }),
    update: async () => ({ data: null }),
    delete: async () => undefined,
  },
}));

mock.module('@/lib/services/project-review.service.server', () => ({
  getAllForAdmin: async (params: unknown) => {
    reviewState.getAllCalls.push(params);
    return reviewState.getAllResult;
  },
  createReviewLink: async (data: unknown, expiryDays?: number) => {
    reviewState.createCalls.push({ data, expiryDays });
    return reviewState.createResult;
  },
}));

mock.module('@/lib/services/newsletter.service.server', () => ({
  getAllSubscribers: async (params: unknown) => {
    newsletterState.getAllCalls.push(params);
    return newsletterState.getAllResult;
  },
}));

mock.module('@/lib/services/category.service.server', () => ({
  getAllCategories: async (params: unknown) => {
    categoryState.getAllCalls.push(params);
    return categoryState.getAllResult;
  },
  createCategory: async () => ({ data: null }),
  getCategoryById: async () => ({ data: null }),
  updateCategory: async () => ({ data: null }),
  deleteCategory: async () => undefined,
}));

mock.module('@/lib/services/ai.service.server', () => ({
  suggestArticleTopics: async (params: unknown) => {
    aiState.suggestCalls.push(params);
    return aiState.suggestResult;
  },
}));

mock.module('@/locales/dictionaries', () => ({
  getDictionary: async (locale: string) => {
    dictionaryState.calls.push(locale);
    return dictionaryState.result;
  },
}));

mock.module('@/lib/storage', () => ({
  getStorageClient: () => storageState.client,
  ensureBucket: async () => {
    storageState.ensureBucketCalls += 1;
    return storageState.ensureBucketResult;
  },
  upload: async (
    key: string,
    body: ArrayBuffer | Buffer | Uint8Array,
    contentType: string,
  ) => {
    const size =
      body instanceof ArrayBuffer
        ? body.byteLength
        : body instanceof Uint8Array
          ? body.byteLength
          : body.length;
    storageState.uploadCalls.push({ key, contentType, size });
    return storageState.uploadResult;
  },
}));

let blogCoverRoute: typeof import('@/app/api/admin/upload/blog-cover/route');
let photoRoute: typeof import('@/app/api/admin/upload/photo/route');
let recentRoute: typeof import('@/app/api/admin/dashboard/recent/route');
let reviewsRoute: typeof import('@/app/api/admin/reviews/route');
let newsletterRoute: typeof import('@/app/api/admin/newsletter/route');
let dictionaryRoute: typeof import('@/app/api/admin/dictionary/route');
let suggestionsRoute: typeof import('@/app/api/admin/suggestions/route');

const originalOpenAiApiKey = process.env.OPENAI_API_KEY;

describe('admin misc routes', () => {
  beforeAll(async () => {
    blogCoverRoute = await import('@/app/api/admin/upload/blog-cover/route');
    photoRoute = await import('@/app/api/admin/upload/photo/route');
    recentRoute = await import('@/app/api/admin/dashboard/recent/route');
    reviewsRoute = await import('@/app/api/admin/reviews/route');
    newsletterRoute = await import('@/app/api/admin/newsletter/route');
    dictionaryRoute = await import('@/app/api/admin/dictionary/route');
    suggestionsRoute = await import('@/app/api/admin/suggestions/route');
  });

  afterAll(() => {
    process.env.OPENAI_API_KEY = originalOpenAiApiKey;
  });

  beforeEach(() => {
    requireAuth.mockClear();
    blogState.getAllCalls = [];
    blogState.getAllResultByLocale = new Map();
    projectState.getAllCalls = [];
    projectState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    reviewState.getAllCalls = [];
    reviewState.createCalls = [];
    reviewState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    reviewState.createResult = { data: { id: 'review-1', token: 'abc123' } };
    newsletterState.getAllCalls = [];
    newsletterState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    categoryState.getAllCalls = [];
    categoryState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    aiState.suggestCalls = [];
    aiState.suggestResult = {
      topics: ['Topic 1', 'Topic 2'],
      categorySuggestions: ['SEO local', 'Refonte'],
    };
    dictionaryState.calls = [];
    dictionaryState.result = {
      admin: { common: { title: 'Admin' } },
      services: {
        website: { title: 'Website' },
        ecommerce: { title: 'E-commerce' },
        redesign: { title: 'Redesign' },
        maintenance: { title: 'Maintenance' },
        innovation: { title: 'Innovation' },
        mobileapp: { title: 'Mobile App' },
      },
    };
    storageState.client = {};
    storageState.ensureBucketCalls = 0;
    storageState.ensureBucketResult = true;
    storageState.uploadCalls = [];
    storageState.uploadResult = {
      key: 'uploads/file.png',
      url: 'https://cdn.test/uploads/file.png',
    };
    delete process.env.OPENAI_API_KEY;
  });

  it('returns 503 for blog cover uploads when storage is unavailable', async () => {
    storageState.client = null;

    const formData = new FormData();
    formData.set(
      'file',
      new File(['image'], 'cover.png', { type: 'image/png' }),
    );

    const request = new NextRequest(
      'http://localhost/api/admin/upload/blog-cover',
      {
        method: 'POST',
        body: formData,
      },
    );

    const response = await blogCoverRoute.POST(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(503);
    expect(json).toEqual({ error: 'Storage (MinIO) is not configured' });
  });

  it('uploads a blog cover and prefixes the storage path', async () => {
    const formData = new FormData();
    formData.set(
      'file',
      new File(['image-bytes'], 'cover.png', { type: 'image/png' }),
    );

    const request = new NextRequest(
      'http://localhost/api/admin/upload/blog-cover',
      {
        method: 'POST',
        body: formData,
      },
    );

    const response = await blogCoverRoute.POST(request);
    const json = await response.json();

    expect(storageState.ensureBucketCalls).toBe(1);
    expect(storageState.uploadCalls).toHaveLength(1);
    expect(storageState.uploadCalls[0]?.key.startsWith('blog-covers/')).toBe(
      true,
    );
    expect(storageState.uploadCalls[0]?.key.endsWith('.png')).toBe(true);
    expect(storageState.uploadCalls[0]?.contentType).toBe('image/png');
    expect(response.status).toBe(200);
    expect(json).toEqual({ url: storageState.uploadResult?.url });
  });

  it('rejects invalid photo upload types', async () => {
    const formData = new FormData();
    formData.set(
      'file',
      new File(['text'], 'notes.txt', { type: 'text/plain' }),
    );

    const request = new NextRequest('http://localhost/api/admin/upload/photo', {
      method: 'POST',
      body: formData,
    });

    const response = await photoRoute.POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json).toEqual({
      error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
    });
  });

  it('uploads a photo to the root storage path', async () => {
    const formData = new FormData();
    formData.set(
      'file',
      new File(['avatar'], 'avatar.webp', { type: 'image/webp' }),
    );

    const request = new NextRequest('http://localhost/api/admin/upload/photo', {
      method: 'POST',
      body: formData,
    });

    const response = await photoRoute.POST(request);
    const json = await response.json();

    expect(storageState.ensureBucketCalls).toBe(1);
    expect(storageState.uploadCalls).toHaveLength(1);
    expect(storageState.uploadCalls[0]?.key.includes('/')).toBe(false);
    expect(storageState.uploadCalls[0]?.key.endsWith('.webp')).toBe(true);
    expect(response.status).toBe(200);
    expect(json).toEqual({ url: storageState.uploadResult?.url });
  });

  it('merges recent blog and project activity with pagination', async () => {
    blogState.getAllResultByLocale.set('fr', {
      data: [
        {
          id: 'blog-1',
          title: 'Article recent',
          status: 'published',
          locale: 'fr',
          updatedAt: new Date('2026-04-10T09:00:00.000Z'),
        },
      ],
      pagination: { page: 1, limit: 500, total: 1, pages: 1 },
    });
    projectState.getAllResult = {
      data: [
        {
          id: 'project-1',
          title: 'Projet plus recent',
          status: 'draft',
          locale: 'en',
          updatedAt: new Date('2026-04-10T10:00:00.000Z'),
        },
      ],
      pagination: { page: 1, limit: 500, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/dashboard/recent?page=1&limit=1',
    );

    const response = await recentRoute.GET(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(blogState.getAllCalls).toHaveLength(5);
    expect(projectState.getAllCalls[0]).toEqual({ page: 1, limit: 500 });
    expect(response.status).toBe(200);
    expect(json).toEqual({
      data: [
        {
          id: 'project-1',
          type: 'project',
          title: 'Projet plus recent',
          status: 'draft',
          locale: 'en',
          updatedAt: '2026-04-10T10:00:00.000Z',
          href: '/admin/projects/project-1',
        },
      ],
      pagination: { page: 1, limit: 1, total: 2, pages: 2 },
      success: true,
    });
  });

  it('lists reviews for the admin', async () => {
    reviewState.getAllResult = {
      data: [{ id: 'review-1', projectTitle: 'Projet', clientName: 'Client' }],
      pagination: { page: 2, limit: 5, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/reviews?page=2&limit=5&status=submitted',
    );

    const response = await reviewsRoute.GET(request);
    const json = await response.json();

    expect(reviewState.getAllCalls[0]).toEqual({
      page: 2,
      limit: 5,
      status: 'submitted',
    });
    expect(response.status).toBe(200);
    expect(json).toEqual(reviewState.getAllResult);
  });

  it('creates a review link with parsed expiry days', async () => {
    const body = {
      projectId: 'project-1',
      clientId: 'client-1',
      expiryDays: 14,
    };

    const request = new NextRequest('http://localhost/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await reviewsRoute.POST(request);
    const json = await response.json();

    expect(reviewState.createCalls).toEqual([
      {
        data: { projectId: 'project-1', clientId: 'client-1' },
        expiryDays: 14,
      },
    ]);
    expect(response.status).toBe(201);
    expect(json).toEqual(reviewState.createResult);
  });

  it('returns 400 for invalid review creation payloads', async () => {
    const request = new NextRequest('http://localhost/api/admin/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId: '',
        clientId: 'client-1',
        expiryDays: 0,
      }),
    });

    const response = await reviewsRoute.POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(Array.isArray(json.error)).toBe(true);
    expect(reviewState.createCalls).toHaveLength(0);
  });

  it('lists newsletter subscribers with pagination', async () => {
    newsletterState.getAllResult = {
      data: [{ id: 'subscriber-1', email: 'hello@example.com' }],
      pagination: { page: 3, limit: 20, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/newsletter?page=3&limit=20',
    );

    const response = await newsletterRoute.GET(request);
    const json = await response.json();

    expect(newsletterState.getAllCalls[0]).toEqual({ page: 3, limit: 20 });
    expect(response.status).toBe(200);
    expect(json).toEqual(newsletterState.getAllResult);
  });

  it('falls back to the default locale for the admin dictionary', async () => {
    const request = new Request(
      'http://localhost/api/admin/dictionary?locale=invalid-locale',
    );

    const response = await dictionaryRoute.GET(request);
    const json = await response.json();

    expect(dictionaryState.calls).toEqual(['fr']);
    expect(response.status).toBe(200);
    expect(json).toEqual(dictionaryState.result);
  });

  it('loads admin suggestions with categories and AI topics when configured', async () => {
    process.env.OPENAI_API_KEY = 'test-key';
    blogState.getAllResultByLocale.set('en', {
      data: [
        {
          id: 'blog-1',
          title: 'Recent article',
          status: 'published',
          locale: 'en',
          updatedAt: '2026-04-09T10:00:00.000Z',
        },
      ],
      pagination: { page: 1, limit: 15, total: 1, pages: 1 },
    });
    categoryState.getAllResult = {
      data: [
        { id: 'cat-1', name: 'SEO' },
        { id: 'cat-2', name: 'Performance' },
        { id: 'cat-3', name: 'SEO Migration' },
      ],
      pagination: { page: 1, limit: 100, total: 3, pages: 1 },
    };
    aiState.suggestResult = {
      topics: ['SEO for migration projects', 'Performance quick wins'],
      categorySuggestions: ['SEO Migration', 'Web Performance'],
    };

    const request = new NextRequest(
      'http://localhost/api/admin/suggestions?locale=en&count=20&categoryIds=cat-2,cat-1',
    );

    const response = await suggestionsRoute.GET(request);
    const json = await response.json();

    expect(dictionaryState.calls).toEqual(['en']);
    expect(blogState.getAllCalls[0]).toEqual({
      page: 1,
      limit: 15,
      locale: 'en',
    });
    expect(categoryState.getAllCalls[0]).toEqual({ limit: 100, locale: 'en' });
    expect(aiState.suggestCalls[0]).toEqual({
      serviceTitles: [
        'Website',
        'E-commerce',
        'Redesign',
        'Maintenance',
        'Innovation',
        'Mobile App',
      ],
      recentArticleTitles: ['Recent article'],
      count: 15,
      locale: 'en',
      categoryNames: ['SEO', 'Performance'],
    });
    expect(response.status).toBe(200);
    expect(json).toEqual({
      data: {
        suggestions: ['SEO for migration projects', 'Performance quick wins'],
        categorySuggestions: ['Web Performance'],
        latestArticles: [
          {
            id: 'blog-1',
            title: 'Recent article',
            status: 'published',
            locale: 'en',
            updatedAt: '2026-04-09T10:00:00.000Z',
          },
        ],
        services: [
          { key: 'website', title: 'Website' },
          { key: 'ecommerce', title: 'E-commerce' },
          { key: 'redesign', title: 'Redesign' },
          { key: 'maintenance', title: 'Maintenance' },
          { key: 'innovation', title: 'Innovation' },
          { key: 'mobileapp', title: 'Mobile App' },
        ],
      },
    });
  });

  it('returns empty suggestions when the AI key is missing', async () => {
    blogState.getAllResultByLocale.set('fr', {
      data: [{ id: 'blog-1', title: 'Article recent' }],
      pagination: { page: 1, limit: 15, total: 1, pages: 1 },
    });

    const request = new NextRequest(
      'http://localhost/api/admin/suggestions?locale=fr',
    );

    const response = await suggestionsRoute.GET(request);
    const json = await response.json();

    expect(aiState.suggestCalls).toHaveLength(0);
    expect(response.status).toBe(200);
    expect(json.data.suggestions).toEqual([]);
    expect(json.data.categorySuggestions).toEqual([]);
  });
});
