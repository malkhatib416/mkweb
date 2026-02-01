import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getAllCategories } from '@/lib/services/category.service.server';
import { getDictionary } from '@/locales/dictionaries';
import { isValidLocale } from '@/locales/i18n';
import type { BlogPost } from '@/types';
import type { Blog } from '@/types/entities';
import BlogPage from './_components/blog-page';

export default async function Blog() {
  const locale = await getLocaleFromHeaders();
  const safeLocale = isValidLocale(locale) ? locale : 'fr';
  const dict = await getDictionary(safeLocale);
  const [{ data: blogs }, { data: categories }] = await Promise.all([
    blogServiceServer.getAll({
      status: 'published',
      locale: safeLocale,
      limit: 1000,
      page: 1,
    }),
    getAllCategories({ limit: 100 }),
  ]);
  const posts: BlogPost[] = (
    blogs as (Blog & { category?: { id: string; name: string } | null })[]
  ).map((blog) => ({
    id: blog.id,
    slug: blog.slug,
    title: blog.title,
    description: blog.description ?? '',
    content: '',
    categories: blog.categoryId ? [blog.categoryId] : [],
    author: 'MK-Web',
    publishedAt: new Date(blog.createdAt).toISOString(),
    readTime: (blog as Blog & { readingTime?: number | null }).readingTime ?? 5,
    image: blog.image ?? undefined,
  }));
  const categoriesForDisplay = categories.map((c) => ({
    id: c.id,
    name: c.name,
    color: undefined as string | undefined,
  }));

  return (
    <BlogPage
      dict={dict}
      locale={safeLocale}
      posts={posts}
      categories={categoriesForDisplay}
    />
  );
}
