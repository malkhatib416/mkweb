/**
 * Client service - Server-side database operations
 */

import { db } from '@/db';
import { client } from '@/db/schema';
import { count, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import type {
  Client,
  ClientListParams,
  ClientListResponse,
  ClientResponse,
  CreateClientDto,
  UpdateClientDto,
} from '@/types/entities';

export const clientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email().optional().or(z.literal('')),
  company: z.string().optional(),
  photo: z.string().url().optional().or(z.literal('')),
});

export const clientUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional().or(z.literal('')),
  company: z.string().optional(),
  photo: z.string().url().optional().or(z.literal('')),
});

class ClientServiceServer {
  async getAll(params: ClientListParams = {}): Promise<ClientListResponse> {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const clients = await db.query.client.findMany({
      limit,
      offset,
      orderBy: (c, { desc: d }) => [d(c.createdAt)],
    });

    const [totalResult] = await db.select({ count: count() }).from(client);
    const total = totalResult?.count || 0;

    return {
      data: clients as Client[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async getById(id: string): Promise<ClientResponse> {
    const c = await db.query.client.findFirst({
      where: (t, { eq: e }) => e(t.id, id),
    });

    if (!c) throw new Error('Client not found');
    return { data: c as Client };
  }

  async create(data: CreateClientDto): Promise<ClientResponse> {
    const validated = clientSchema.parse({
      ...data,
      email: data.email || '',
      photo: data.photo || '',
    });

    const [newClient] = await db
      .insert(client)
      .values({
        name: validated.name,
        email: validated.email || null,
        company: validated.company || null,
        photo: validated.photo || null,
      })
      .returning();

    return { data: newClient as Client };
  }

  async update(id: string, data: UpdateClientDto): Promise<ClientResponse> {
    const validated = clientUpdateSchema.parse({
      ...data,
      email: data.email ?? '',
      photo: data.photo ?? '',
    });

    const [updated] = await db
      .update(client)
      .set({
        ...validated,
        email: validated.email || null,
        photo: validated.photo || null,
        updatedAt: new Date(),
      })
      .where(eq(client.id, id))
      .returning();

    if (!updated) throw new Error('Client not found');
    return { data: updated as Client };
  }

  async delete(id: string): Promise<void> {
    const [deleted] = await db
      .delete(client)
      .where(eq(client.id, id))
      .returning();

    if (!deleted) throw new Error('Client not found');
  }
}

export const clientServiceServer = new ClientServiceServer();
