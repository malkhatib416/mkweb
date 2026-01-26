import { Category } from '@/types';

/**
 * Blog categories used for filtering and display
 * Blog posts are stored as MDX files in /content/blog directory
 * Use getAllBlogPosts() from @/lib/mdx to fetch blog posts
 */
export const categories: Category[] = [
  { id: 'seo', name: 'SEO', color: 'background: #34a853; color: #fff;' },
  {
    id: 'refonte',
    name: 'Refonte',
    color: 'background: #e67e22; color: #fff;',
  },
  { id: 'tech', name: 'Tech', color: 'background: #6c63ff; color: #fff;' },
  { id: 'nextjs', name: 'Next.js', color: 'background: #111827; color: #fff;' },
  {
    id: 'architecture',
    name: 'Architecture',
    color: 'background: #f59e0b; color: #fff;',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    color: 'background: #007acc; color: #fff;',
  },
  {
    id: 'technique',
    name: 'Technique',
    color: 'background: #8b5cf6; color: #fff;',
  },
];
