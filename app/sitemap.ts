import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/mdx';
import { locales } from '@/locales/i18n';

const baseUrl = 'https://mk-web.fr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  // Fetch blog posts from MDX files for each locale
  const blogEntriesPromises = locales.map(async (locale) => {
    const posts = await getAllBlogPosts(locale);
    return posts.map((post) => ({
      url: `${baseUrl}/${locale}/blog/${post.id}`,
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  });

  const blogEntriesArrays = await Promise.all(blogEntriesPromises);
  const blogEntries = blogEntriesArrays.flat();

  return [...routeEntries, ...blogEntries];
}
