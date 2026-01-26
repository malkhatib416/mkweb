import { categories } from '@/data';
import { getBlogPostById, getBlogPostSlugs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { User, Calendar, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';
import type { Locale } from '@/locales/i18n';
import { locales } from '@/locales/i18n';
import { getDictionary } from '@/locales/dictionaries';

interface BlogPostPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export async function generateStaticParams() {
  const allParams: { id: string; locale: string }[] = [];

  for (const locale of locales) {
    const slugs = await getBlogPostSlugs(locale);
    const params = slugs.map((slug) => ({ id: slug, locale }));
    allParams.push(...params);
  }

  return allParams;
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { id, locale } = await params;
  const post = await getBlogPostById(id, locale as Locale);
  const dict = await getDictionary(locale as Locale);

  if (!post) return notFound();

  // Dynamically import the MDX file from locale-specific directory
  const MDXContent = dynamic(
    () => import(`@/content/blog/${locale}/${id}.mdx`),
  );

  const formatDate = (dateString: string) => {
    const localeMap: Record<string, string> = {
      fr: 'fr-FR',
      en: 'en-US',
    };
    return new Date(dateString).toLocaleDateString(
      localeMap[locale] || 'fr-FR',
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
    );
  };

  return (
    <div className="min-h-screen bg-white mt-12">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-6">
          {post.categories.map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            return category ? (
              <span
                key={categoryId}
                style={category.color ? parseCategoryColor(category.color) : {}}
                className="px-3 py-1 rounded-full text-xs font-medium shadow"
              >
                {category.name}
              </span>
            ) : null;
          })}
        </div>
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
          {post.title}
        </h1>
        {/* Meta */}
        <div className="flex items-center space-x-6 text-gray-500 mb-12 pb-6 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span className="text-sm">{post.author}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {post.readTime} {dict.blog.readTime}
            </span>
          </div>
        </div>
        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {post.description}
        </p>
        {/* MDX Content */}
        <div className="prose prose-lg max-w-none">
          <MDXContent />
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;

function parseCategoryColor(colorString: string) {
  const style: Record<string, string> = {};
  colorString.split(';').forEach((rule) => {
    const [key, value] = rule.split(':').map((s) => s && s.trim());
    if (key && value) {
      if (key === 'background') style.background = value;
      else if (key === 'color') style.color = value;
    }
  });
  return style;
}
