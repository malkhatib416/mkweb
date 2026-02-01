/**
 * Project review service - handles review link API calls (admin)
 */

import type { ProjectReviewListResponse } from '@/types/entities';

export type ReviewListStatus = 'pending' | 'submitted';

export interface ReviewListParams {
  page?: number;
  limit?: number;
  status?: ReviewListStatus;
}

class ProjectReviewService {
  private baseUrl = '/api/admin/reviews';

  async getList(
    params: ReviewListParams = {},
  ): Promise<ProjectReviewListResponse> {
    const { page = 1, limit = 10, status } = params;
    const search = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });
    if (status) search.set('status', status);

    const response = await fetch(`${this.baseUrl}?${search}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch reviews');
    }

    return data;
  }
}

export const projectReviewService = new ProjectReviewService();
