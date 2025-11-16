import { MetadataRoute } from 'next';
import { blogPosts } from '@/data';
import { locales } from '@/locales/i18n';

const baseUrl = 'https://mk-web.fr';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    {
      path: '',
      priority: 1,
      changeFrequency: 'yearly' as const,
    },
    {
      path: '/mentions-legales',
      priority: 0.8,
      changeFrequency: 'yearly' as const,
    },
    {
      path: '/blog',
      priority: 0.9,
      changeFrequency: 'weekly' as const,
    },
  ];

  // Generate sitemap entries for all routes in all locales
  const routeEntries = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  );

  // Generate sitemap entries for all blog posts in all locales
  const blogEntries = blogPosts.flatMap((post) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/blog/${post.id}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  );

  return [...routeEntries, ...blogEntries];
}
