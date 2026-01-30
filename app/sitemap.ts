import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/mdx';
import { locales } from '@/locales/i18n';
import { projectServiceServer } from '@/lib/services/project.service.server';
import { APP_URL } from '@/utils/consts';

const baseUrl = APP_URL || 'https://mk-web.fr';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { path: '', priority: 1, changeFrequency: 'yearly' as const },
    {
      path: '/mentions-legales',
      priority: 0.8,
      changeFrequency: 'yearly' as const,
    },
    { path: '/blog', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' as const },
  ];

  const routeEntries = routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}${route.path}`,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    })),
  );

  const [blogEntriesArrays, projectSlugsByLocale] = await Promise.all([
    Promise.all(
      locales.map(async (locale) => {
        const posts = await getAllBlogPosts(locale);
        return posts.map((post) => ({
          url: `${baseUrl}/${locale}/blog/${post.id}`,
          lastModified: new Date(post.publishedAt),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }));
      }),
    ),
    Promise.all(
      locales.map((locale) =>
        projectServiceServer.getPublished(locale).then((projects) =>
          projects.map((p) => ({
            url: `${baseUrl}/${locale}/projects/${p.slug}`,
            lastModified: new Date(p.updatedAt),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
          })),
        ),
      ),
    ),
  ]);

  const blogEntries = blogEntriesArrays.flat();
  const projectEntries = projectSlugsByLocale.flat();

  return [...routeEntries, ...blogEntries, ...projectEntries];
}
