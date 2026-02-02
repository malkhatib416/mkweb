/**
 * Client service - handles all client-related API calls
 */

import type {
  ClientListParams,
  ClientListResponse,
  ClientResponse,
  CreateClientDto,
  UpdateClientDto,
} from '@/types/entities';

class ClientService {
  private baseUrl = '/api/admin/clients';

  async getAll(params: ClientListParams = {}): Promise<ClientListResponse> {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch clients');
    }

    return data;
  }

  async getById(id: string): Promise<ClientResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch client');
    }

    return data;
  }

  async create(data: CreateClientDto): Promise<ClientResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create client');
    }

    return result;
  }

  async update(id: string, data: UpdateClientDto): Promise<ClientResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update client');
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete client');
    }
  }
}

export const clientService = new ClientService();
