import { beforeAll, beforeEach, describe, expect, it, mock } from 'bun:test';
import { NextRequest } from 'next/server';

const requireAuth = mock(async () => undefined);

type ClientRouteSummary = {
  id: string;
  companyName: string;
  email: string;
};

const clientState = {
  getAllCalls: [] as unknown[],
  createCalls: [] as unknown[],
  getByIdCalls: [] as string[],
  updateCalls: [] as Array<{ id: string; body: unknown }>,
  deleteCalls: [] as string[],
  getAllResult: {
    data: [] as ClientRouteSummary[],
    pagination: { page: 1, limit: 10, total: 0, pages: 1 },
  },
  createResult: {
    data: { id: 'client-1', companyName: 'MK Web', email: 'team@mk.test' },
  },
  getByIdResult: {
    data: { id: 'client-1', companyName: 'MK Web', email: 'team@mk.test' },
  },
  updateResult: {
    data: {
      id: 'client-1',
      companyName: 'MK Web Studio',
      email: 'contact@mk.test',
    },
  },
};

mock.module('@/lib/auth-utils', () => ({
  requireAuth,
}));

mock.module('@/lib/services/client.service.server', () => ({
  clientServiceServer: {
    getAll: async (params: unknown) => {
      clientState.getAllCalls.push(params);
      return clientState.getAllResult;
    },
    create: async (body: unknown) => {
      clientState.createCalls.push(body);
      return clientState.createResult;
    },
    getById: async (id: string) => {
      clientState.getByIdCalls.push(id);
      return clientState.getByIdResult;
    },
    update: async (id: string, body: unknown) => {
      clientState.updateCalls.push({ id, body });
      return clientState.updateResult;
    },
    delete: async (id: string) => {
      clientState.deleteCalls.push(id);
    },
  },
}));

let collectionRoute: typeof import('@/app/api/admin/clients/route');
let itemRoute: typeof import('@/app/api/admin/clients/[id]/route');

describe('admin client routes', () => {
  beforeAll(async () => {
    collectionRoute = await import('@/app/api/admin/clients/route');
    itemRoute = await import('@/app/api/admin/clients/[id]/route');
  });

  beforeEach(() => {
    requireAuth.mockClear();
    clientState.getAllCalls = [];
    clientState.createCalls = [];
    clientState.getByIdCalls = [];
    clientState.updateCalls = [];
    clientState.deleteCalls = [];
    clientState.getAllResult = {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 1 },
    };
    clientState.createResult = {
      data: { id: 'client-1', companyName: 'MK Web', email: 'team@mk.test' },
    };
    clientState.getByIdResult = {
      data: { id: 'client-1', companyName: 'MK Web', email: 'team@mk.test' },
    };
    clientState.updateResult = {
      data: {
        id: 'client-1',
        companyName: 'MK Web Studio',
        email: 'contact@mk.test',
      },
    };
  });

  it('lists clients from pagination query parameters', async () => {
    clientState.getAllResult = {
      data: [
        {
          id: 'client-1',
          companyName: 'MK Web Studio',
          email: 'contact@mk.test',
        },
      ],
      pagination: { page: 2, limit: 5, total: 1, pages: 1 },
    };

    const request = new NextRequest(
      'http://localhost/api/admin/clients?page=2&limit=5',
    );

    const response = await collectionRoute.GET(request);
    const json = await response.json();

    expect(requireAuth).toHaveBeenCalledTimes(1);
    expect(clientState.getAllCalls[0]).toEqual({ page: 2, limit: 5 });
    expect(response.status).toBe(200);
    expect(json).toEqual(clientState.getAllResult);
  });

  it('creates a client and returns 201', async () => {
    const body = {
      companyName: 'Acme',
      contactName: 'Jane Doe',
      email: 'jane@acme.test',
      phone: '+33 6 00 00 00 00',
    };

    const request = new NextRequest('http://localhost/api/admin/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const response = await collectionRoute.POST(request);
    const json = await response.json();

    expect(clientState.createCalls[0]).toEqual(body);
    expect(response.status).toBe(201);
    expect(json).toEqual(clientState.createResult);
  });

  it('gets a single client by id', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/clients/client-1',
    );

    const response = await itemRoute.GET(request, {
      params: Promise.resolve({ id: 'client-1' }),
    });
    const json = await response.json();

    expect(clientState.getByIdCalls).toEqual(['client-1']);
    expect(response.status).toBe(200);
    expect(json).toEqual(clientState.getByIdResult);
  });

  it('updates a client by id', async () => {
    const body = {
      companyName: 'MK Web Studio',
      contactName: 'John Doe',
      email: 'contact@mk.test',
    };

    const request = new NextRequest(
      'http://localhost/api/admin/clients/client-1',
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );

    const response = await itemRoute.PUT(request, {
      params: Promise.resolve({ id: 'client-1' }),
    });
    const json = await response.json();

    expect(clientState.updateCalls).toEqual([{ id: 'client-1', body }]);
    expect(response.status).toBe(200);
    expect(json).toEqual(clientState.updateResult);
  });

  it('deletes a client by id', async () => {
    const request = new NextRequest(
      'http://localhost/api/admin/clients/client-1',
      {
        method: 'DELETE',
      },
    );

    const response = await itemRoute.DELETE(request, {
      params: Promise.resolve({ id: 'client-1' }),
    });
    const json = await response.json();

    expect(clientState.deleteCalls).toEqual(['client-1']);
    expect(response.status).toBe(200);
    expect(json).toEqual({ message: 'Client deleted successfully' });
  });
});
