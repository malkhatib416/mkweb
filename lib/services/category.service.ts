/**
 * Category service - handles all category-related API calls (admin)
 */

import type {
  CategoryListParams,
  CategoryListResponse,
  CategoryResponse,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '@/types/entities';

class CategoryService {
  private baseUrl = '/api/admin/categories';

  async getAll(params: CategoryListParams = {}): Promise<CategoryListResponse> {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch categories');
    }

    return data;
  }

  async getById(id: string): Promise<CategoryResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`);
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
