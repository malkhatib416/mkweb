import BlogPage from './_components/blog-page';
import { getDictionary } from '@/locales/dictionaries';
import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { getAllBlogPosts } from '@/lib/mdx';

export default async function Blog() {
  const locale = await getLocaleFromHeaders();
  const dict = await getDictionary(locale);
  const posts = await getAllBlogPosts(locale);

  return <BlogPage dict={dict} locale={locale} posts={posts} />;
}
