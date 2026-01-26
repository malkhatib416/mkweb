/**
 * Blog service - handles all blog-related API calls
 */

export interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogDto {
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  status: 'draft' | 'published';
}

export interface UpdateBlogDto {
  title?: string;
  slug?: string;
  description?: string | null;
  content?: string;
  status?: 'draft' | 'published';
}

export interface BlogListResponse {
  data: Blog[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface BlogResponse {
  data: Blog;
}

export interface BlogListParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published';
}

class BlogService {
  private baseUrl = '/api/admin/blogs';

  /**
   * Get all blogs with pagination
   */
  async getAll(params: BlogListParams = {}): Promise<BlogListResponse> {
    const { page = 1, limit = 10, status } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) {
      queryParams.append('status', status);
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
      body: JSON.stringify({
        title: data.title,
        slug: data.slug,
        description: data.description || null,
        content: data.content,
        status: data.status,
      }),
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
      body: JSON.stringify({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.description !== undefined && {
          description: data.description || null,
        }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.status !== undefined && { status: data.status }),
      }),
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
