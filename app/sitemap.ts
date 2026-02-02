import { blogServiceServer } from '@/lib/services/blog.service.server';
import { projectServiceServer } from '@/lib/services/project.service.server';
import { locales } from '@/locales/i18n';
import { APP_URL } from '@/utils/consts';
import { MetadataRoute } from 'next';

const baseUrl = APP_URL || 'https://mk-web.fr';

/** Public sitemap only. Admin routes (/admin/*) are intentionally excluded. */
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
    // Load all published blog articles (with pagination so we include every article)
    Promise.all(
      locales.map(async (locale) => {
        const limit = 100;
        let page = 1;
        let allPosts: Awaited<
          ReturnType<typeof blogServiceServer.getAll>
        >['data'] = [];
        let hasMore = true;
        while (hasMore) {
          const { data: posts, pagination } = await blogServiceServer.getAll({
            status: 'published',
            locale,
            limit,
            page,
          });
          const list = posts ?? [];
          allPosts = allPosts.concat(list);
          hasMore = page < (pagination?.pages ?? 1);
          page += 1;
        }
        return allPosts.map((post) => ({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.updatedAt),
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
