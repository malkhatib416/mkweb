/**
 * Project service - handles all project-related API calls
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectDto {
  title: string;
  slug: string;
  description?: string | null;
  content: string;
  status: 'draft' | 'published';
}

export interface UpdateProjectDto {
  title?: string;
  slug?: string;
  description?: string | null;
  content?: string;
  status?: 'draft' | 'published';
}

export interface ProjectListResponse {
  data: Project[];
  pagination: {
    total: number;
    page: number;
    limit: number;
  };
}

export interface ProjectResponse {
  data: Project;
}

export interface ProjectListParams {
  page?: number;
  limit?: number;
  status?: 'draft' | 'published';
}

class ProjectService {
  private baseUrl = '/api/admin/projects';

  /**
   * Get all projects with pagination
   */
  async getAll(params: ProjectListParams = {}): Promise<ProjectListResponse> {
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
      throw new Error(data.error || 'Failed to fetch projects');
    }

    return data;
  }

  /**
   * Get a single project by ID
   */
  async getById(id: string): Promise<ProjectResponse> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch project');
    }

    return data;
  }

  /**
   * Create a new project
   */
  async create(data: CreateProjectDto): Promise<ProjectResponse> {
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
      throw new Error(result.error || 'Failed to create project');
    }

    return result;
  }

  /**
   * Update an existing project
   */
  async update(id: string, data: UpdateProjectDto): Promise<ProjectResponse> {
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
      throw new Error(result.error || 'Failed to update project');
    }

    return result;
  }

  /**
   * Delete a project
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete project');
    }
  }
}

export const projectService = new ProjectService();
