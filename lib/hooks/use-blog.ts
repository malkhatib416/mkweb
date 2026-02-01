import { fetcher } from '@/lib/swr-fetcher';
import type { Blog, BlogResponse } from '@/types/entities';
import useSWR from 'swr';

const BLOG_API = '/api/admin/blogs';

/**
 * Returns the cover image URL from a blog, or null if none.
 */
export function getBlogImageUrl(blog: Blog | null | undefined): string | null {
  if (!blog) return null;
  const img = (blog as Blog & { image?: string | null }).image;
  return img && typeof img === 'string' ? img : null;
}

/**
 * Fetches a single blog by id from the API using SWR.
 */
export function useBlog(id: string | null) {
  const { data, error, isLoading, mutate } = useSWR<BlogResponse>(
    id ? `${BLOG_API}/${id}` : null,
    fetcher,
  );
  const blog = data?.data ?? null;
  const imageUrl = getBlogImageUrl(blog);
  return {
    blog,
    imageUrl,
    error,
    isLoading,
    mutate,
  };
}
