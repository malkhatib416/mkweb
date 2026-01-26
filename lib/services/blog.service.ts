/**
 * Blog service - handles all blog-related API calls
 */

import type {
  BlogListParams,
  BlogListResponse,
  BlogResponse,
  CreateBlogDto,
  UpdateBlogDto,
} from '@/types/entities';

class BlogService {
  private baseUrl = '/api/admin/blogs';

  /**
   * Get all blogs with pagination
   */
  async getAll(params: BlogListParams = {}): Promise<BlogListResponse> {
    const { page = 1, limit = 10, status, locale } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      queryParams.append('status', status);
    }
    if (locale) {
      queryParams.append('locale', locale);
    }

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch blogs');
    }

    return data;
  }

  /**
   * Get a single blog by ID
   */
  async getById(id: string): Promise<BlogResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch blog');
    }

    return data;
  }

  /**
   * Create a new blog
   */
  async create(data: CreateBlogDto): Promise<BlogResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create blog');
    }

    return result;
  }

  /**
   * Update an existing blog
   */
  async update(id: string, data: UpdateBlogDto): Promise<BlogResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to update blog');
    }

    return result;
  }

  /**
   * Delete a blog
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete blog');
    }
  }
}

export const blogService = new BlogService();
