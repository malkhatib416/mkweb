/**
 * Language service - handles all language-related API calls
 */

import type {
  LanguageListParams,
  LanguageListResponse,
  LanguageResponse,
  CreateLanguageDto,
  UpdateLanguageDto,
} from '@/types/entities';

class LanguageService {
  private baseUrl = '/api/admin/languages';

  async getAll(params: LanguageListParams = {}): Promise<LanguageListResponse> {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch languages');
    }

    return data;
  }

  async getById(id: string): Promise<LanguageResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch language');
    }

    return data;
  }

  async create(data: CreateLanguageDto): Promise<LanguageResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create language');
    }

    return result;
  }

  async update(id: string, data: UpdateLanguageDto): Promise<LanguageResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update language');
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete language');
    }
  }
}

export const languageService = new LanguageService();
