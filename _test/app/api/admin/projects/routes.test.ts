import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';

const requireAuth = mock(async () => undefined);

type ProjectRouteSummary = {
  id: string;
  locale: string;
  title: string;
};

const projectServiceState = {
  getAllCalls: [] as unknown[],
  createCalls: [] as unknown[],
  getByIdCalls: [] as unknown[],
  updateCalls: [] as Array<{ id: string; body: unknown }>,
  deleteCalls: [] as string[],
  getAllResult: {
    data: [] as ProjectRouteSummary[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
  createResult: { data: { id: 'project-1', locale: 'fr', title: 'Projet' } },
  getByIdResult: { data: { id: 'project-1', locale: 'fr', title: 'Projet' } },
  updateResult: { data: { id: 'project-1', locale: 'de', title: 'Projekt' } },
};

const projectServiceServer = {
  async getAll(params: unknown) {
    projectServiceState.getAllCalls.push(params);
    return projectServiceState.getAllResult;
  },
  async create(body: unknown) {
    projectServiceState.createCalls.push(body);
    return projectServiceState.createResult;
  },
  async getById(id: string) {
    projectServiceState.getByIdCalls.push(id);
    return projectServiceState.getByIdResult;
  },
  async update(id: string, body: unknown) {
    projectServiceState.updateCalls.push({ id, body });
    return projectServiceState.updateResult;
  },
  async delete(id: string) {
    projectServiceState.deleteCalls.push(id);
  },
};

mock.module('@/lib/auth-utils', () => ({
  requireAuth,
}));

mock.module('@/lib/services/project.service.server', () => ({
  projectServiceServer,
}));

let collectionRoute: typeof import('@/app/api/admin/projects/route');
let itemRoute: typeof import('@/app/api/admin/projects/[id]/route');

describe('admin project routes', () => {
  beforeAll(async () => {
    collectionRoute = await import('@/app/api/admin/projects/route');
    itemRoute = await import('@/app/api/admin/projects/[id]/route');
  });

  beforeEach(() => {
    requireAuth.mockClear();
    projectServiceState.getAllCalls = [];
    projectServiceState.createCalls = [];
    projectServiceState.getByIdCalls = [];
    projectServiceState.updateCalls = [];
    projectServiceState.deleteCalls = [];
    projectServiceState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    projectServiceState.createResult = {
      data: { id: 'project-1', locale: 'fr', title: 'Projet' },
    };
    projectServiceState.getByIdResult = {
      data: { id: 'project-1', locale: 'fr', title: 'Projet' },
    };
    projectServiceState.updateResult = {
      data: { id: 'project-1', locale: 'de', title: 'Projekt' },
    };
  });

  it('lists projects from query parameters', async () => {
    projectServiceState.getAllResult = {
      data: [{ id: 'project-1', locale: 'de', title: 'Projekt' }],
      pagination: { page: 2, limit: 5, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/projects?page=2&limit=5&status=published&locale=de',
    );

    const response = await collectionRoute.GET(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(projectServiceState.getAllCalls[0]).toEqual({
      page: 2,
      limit: 5,
      status: 'published',
      locale: 'de',
    });
    expect(response.status).toBe(200);
    expect(json).toEqual(projectServiceState.getAllResult);
  });

  it('creates a project and returns 201', async () => {
    const body = {
      title: 'Nuovo progetto',
      slug: 'nuovo-progetto',
      locale: 'it',
      content: 'Contenuto',
      status: 'draft',
    };

    const request = new NextRequest('http://localhost/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await collectionRoute.POST(request);
    const json = await response.json();

    expect(projectServiceState.createCalls[0]).toEqual(body);
    expect(response.status).toBe(201);
    expect(json).toEqual(projectServiceState.createResult);
  });

  it('gets a single project by id', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/projects/project-1',
    );

    const response = await itemRoute.GET(request, {
      params: Promise.resolve({ id: 'project-1' }),
    });
    const json = await response.json();

    expect(projectServiceState.getByIdCalls).toEqual(['project-1']);
    expect(response.status).toBe(200);
    expect(json).toEqual(projectServiceState.getByIdResult);
  });

  it('updates a project by id', async () => {
    const body = {
      locale: 'de',
      title: 'Projekt',
      slug: 'projekt',
      content: 'Inhalt',
    };

    const request = new NextRequest(
      'http://localhost/api/admin/projects/project-1',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    const response = await itemRoute.PUT(request, {
      params: Promise.resolve({ id: 'project-1' }),
    });
    const json = await response.json();

    expect(projectServiceState.updateCalls).toEqual([
      { id: 'project-1', body },
    ]);
    expect(response.status).toBe(200);
    expect(json).toEqual(projectServiceState.updateResult);
  });

  it('deletes a project by id', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/projects/project-1',
      {
        method: 'DELETE',
      },
    );

    const response = await itemRoute.DELETE(request, {
      params: Promise.resolve({ id: 'project-1' }),
    });
    const json = await response.json();

    expect(projectServiceState.deleteCalls).toEqual(['project-1']);
    expect(response.status).toBe(200);
    expect(json).toEqual({ message: 'Project deleted successfully' });
  });
});
