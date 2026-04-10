import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';

const requireAuth = mock(async () => undefined);

type CategoryRouteSummary = {
  id: string;
  locale: string;
  name: string;
};

const categoryState = {
  getAllCalls: [] as unknown[],
  createCalls: [] as unknown[],
  getByIdCalls: [] as Array<{ id: string; locale?: string }>,
  updateCalls: [] as Array<{ id: string; body: unknown }>,
  deleteCalls: [] as string[],
  getAllResult: {
    data: [] as CategoryRouteSummary[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
  createResult: { data: { id: 'category-1', locale: 'fr', name: 'SEO' } },
  getByIdResult: { data: { id: 'category-1', locale: 'fr', name: 'SEO' } },
  updateResult: {
    data: { id: 'category-1', locale: 'de', name: 'Technik' },
  },
};

mock.module('@/lib/auth-utils', () => ({
  requireAuth,
}));

mock.module('@/lib/services/category.service.server', () => ({
  getAllCategories: async (params: unknown) => {
    categoryState.getAllCalls.push(params);
    return categoryState.getAllResult;
  },
  createCategory: async (body: unknown) => {
    categoryState.createCalls.push(body);
    return categoryState.createResult;
  },
  getCategoryById: async (id: string, locale?: string) => {
    categoryState.getByIdCalls.push({ id, locale });
    return categoryState.getByIdResult;
  },
  updateCategory: async (id: string, body: unknown) => {
    categoryState.updateCalls.push({ id, body });
    return categoryState.updateResult;
  },
  deleteCategory: async (id: string) => {
    categoryState.deleteCalls.push(id);
  },
}));

let collectionRoute: typeof import('@/app/api/admin/categories/route');
let itemRoute: typeof import('@/app/api/admin/categories/[id]/route');

describe('admin category routes', () => {
  beforeAll(async () => {
    collectionRoute = await import('@/app/api/admin/categories/route');
    itemRoute = await import('@/app/api/admin/categories/[id]/route');
  });

  beforeEach(() => {
    requireAuth.mockClear();
    categoryState.getAllCalls = [];
    categoryState.createCalls = [];
    categoryState.getByIdCalls = [];
    categoryState.updateCalls = [];
    categoryState.deleteCalls = [];
    categoryState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    categoryState.createResult = {
      data: { id: 'category-1', locale: 'fr', name: 'SEO' },
    };
    categoryState.getByIdResult = {
      data: { id: 'category-1', locale: 'fr', name: 'SEO' },
    };
    categoryState.updateResult = {
      data: { id: 'category-1', locale: 'de', name: 'Technik' },
    };
  });

  it('lists categories from query parameters', async () => {
    categoryState.getAllResult = {
      data: [{ id: 'category-1', locale: 'de', name: 'Technik' }],
      pagination: { page: 2, limit: 5, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/categories?page=2&limit=5&locale=de',
    );

    const response = await collectionRoute.GET(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(categoryState.getAllCalls[0]).toEqual({
      page: 2,
      limit: 5,
      locale: 'de',
    });
    expect(response.status).toBe(200);
    expect(json).toEqual(categoryState.getAllResult);
  });

  it('creates a category and returns 201', async () => {
    const body = {
      name: 'Performance',
      slug: 'performance',
      locale: 'fr',
      description: 'Conseils de performance',
    };

    const request = new NextRequest('http://localhost/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await collectionRoute.POST(request);
    const json = await response.json();

    expect(categoryState.createCalls[0]).toEqual(body);
    expect(response.status).toBe(201);
    expect(json).toEqual(categoryState.createResult);
  });

  it('gets a single category by id and locale', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/categories/category-1?locale=de',
    );

    const response = await itemRoute.GET(request, {
      params: Promise.resolve({ id: 'category-1' }),
    });
    const json = await response.json();

    expect(categoryState.getByIdCalls).toEqual([
      { id: 'category-1', locale: 'de' },
    ]);
    expect(response.status).toBe(200);
    expect(json).toEqual(categoryState.getByIdResult);
  });

  it('updates a category by id', async () => {
    const body = {
      name: 'Technik',
      slug: 'technik',
      locale: 'de',
      description: 'Technische Inhalte',
    };

    const request = new NextRequest(
      'http://localhost/api/admin/categories/category-1',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    const response = await itemRoute.PUT(request, {
      params: Promise.resolve({ id: 'category-1' }),
    });
    const json = await response.json();

    expect(categoryState.updateCalls).toEqual([{ id: 'category-1', body }]);
    expect(response.status).toBe(200);
    expect(json).toEqual(categoryState.updateResult);
  });

  it('deletes a category by id', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/categories/category-1',
      { method: 'DELETE' },
    );

    const response = await itemRoute.DELETE(request, {
      params: Promise.resolve({ id: 'category-1' }),
    });
    const json = await response.json();

    expect(categoryState.deleteCalls).toEqual(['category-1']);
    expect(response.status).toBe(200);
    expect(json).toEqual({ message: 'Category deleted successfully' });
  });
});
