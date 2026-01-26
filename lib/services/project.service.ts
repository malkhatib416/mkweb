/**
 * Project service - handles all project-related API calls
 */

import type {
  CreateProjectDto,
  ProjectListParams,
  ProjectListResponse,
  ProjectResponse,
  UpdateProjectDto,
} from '@/types/entities';

class ProjectService {
  private baseUrl = '/api/admin/projects';

  /**
   * Get all projects with pagination
   */
  async getAll(params: ProjectListParams = {}): Promise<ProjectListResponse> {
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
      body: JSON.stringify(data),
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
      body: JSON.stringify(data),
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
