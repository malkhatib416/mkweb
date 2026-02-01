/**
 * Newsletter service - handles newsletter subscriber API calls (admin)
 */

import type { NewsletterSubscriberListResponse } from '@/types/entities';

export interface NewsletterListParams {
  page?: number;
  limit?: number;
}

class NewsletterService {
  private baseUrl = '/api/admin/newsletter';

  async getAll(
    params: NewsletterListParams = {},
  ): Promise<NewsletterSubscriberListResponse> {
    const { page = 1, limit = 10 } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await fetch(`${this.baseUrl}?${queryParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch subscribers');
    }

    return data;
  }
}

export const newsletterService = new NewsletterService();
