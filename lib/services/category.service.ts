/**
 * Category service - handles all category-related API calls (admin)
 */

import type {
  CategoryListParams,
  CategoryListResponse,
  CategoryResponse,
} from '@/types/api';
import type { CreateCategoryDto, UpdateCategoryDto } from '@/types/dto';
import type { Locale } from '@/types/entities';

class CategoryService {
  private baseUrl = '/api/admin/categories';

  async getAll(params: CategoryListParams = {}): Promise<CategoryListResponse> {
    const { page = 1, limit = 10, locale } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (locale) {
      queryParams.append('locale', locale);
    }

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch categories');
    }

    return data;
  }

  async getById(id: string, locale?: Locale): Promise<CategoryResponse> {
    const queryParams = new URLSearchParams();
    if (locale) {
      queryParams.append('locale', locale);
    }

    const response = await fetch(
      `${this.baseUrl}/${id}${
        queryParams.size ? `?${queryParams.toString()}` : ''
      }`,
    );
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch category');
    }

    return data;
  }

  async create(data: CreateCategoryDto): Promise<CategoryResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create category');
    }

    return result;
  }

  async update(id: string, data: UpdateCategoryDto): Promise<CategoryResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update category');
    }

    return result;
  }

  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete category');
    }
  }
}

export const categoryService = new CategoryService();
