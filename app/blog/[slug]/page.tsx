import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { MarkdownRenderer } from '@/lib/markdown';
import { blogServiceServer } from '@/lib/services/blog.service.server';
import { getDictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import { APP_URL } from '@/utils/consts';
import { formatDate } from '@/utils/format-date';
import { Calendar, Clock, User } from 'lucide-react';
import { notFound } from 'next/navigation';

import { ReadingProgressBar } from '../_components/reading-progress-bar';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;
  const locale = (await getLocaleFromHeaders()) as Locale;
  const dict = await getDictionary(locale);
  let blog: Awaited<ReturnType<typeof blogServiceServer.getBySlug>>['data'];
  try {
    const res = await blogServiceServer.getBySlug(slug, locale);
    blog = res.data;
  } catch {
    return notFound();
  }
  if (blog.status !== 'published' || blog.locale !== locale) return notFound();

  const baseUrl = `${APP_URL}/${locale}`;
  const publishedAt = new Date(blog.createdAt).toISOString();
  const blogPostingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.description ?? undefined,
    datePublished: publishedAt,
    author: { '@type': 'Person', name: 'MK-Web' },
    url: `${baseUrl}/blog/${blog.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${blog.slug}`,
    },
  };

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      {/* Extreme Hero Section */}
      <div className="relative w-full h-[70vh] min-h-[500px] overflow-hidden">
        {/* Cover Image with Parallax-ready styling */}
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="absolute inset-0 w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        {/* Dynamic Overlays */}
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/10 to-transparent z-10" />

        {/* Floating Glassmorphism Header */}
        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-1/2 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-2xl p-8 md:p-12 rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/40">
              <div className="max-w-3xl space-y-8">
                {/* Category & Badge */}
                <div className="flex items-center gap-4">
                  {blog.category && (
                    <span className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-myorange-100 text-white shadow-xl shadow-myorange-100/20">
                      {blog.category.name}
                    </span>
                  )}
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    {dict.blog.article}
                  </span>
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tighter">
                  {blog.title}
                </h1>

                {/* Refined Meta */}
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                        Author
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        MK-Web
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Published
                    </span>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-myorange-100" />
                      <span className="text-sm font-bold text-slate-900">
                        {formatDate(publishedAt, locale)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Read Time
                    </span>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-myorange-100" />
                      <span className="text-sm font-bold text-slate-900">
                        {(blog as { readingTime?: number | null })
                          .readingTime ?? 5}{' '}
                        {dict.blog.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-52 pb-24">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Description */}
            {blog.description && (
              <div className="mb-16">
                <p className="text-2xl md:text-3xl text-slate-400 font-medium leading-relaxed italic border-l-4 border-myorange-100 pl-8">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Markdown Content */}
            <div className="prose-container">
              <MarkdownRenderer
                content={blog.content}
                className="prose prose-slate prose-lg max-w-none 
                  prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-a:text-myorange-100 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-3xl prose-img:shadow-2xl
                  prose-strong:text-slate-900
                  prose-blockquote:border-myorange-100 prose-blockquote:bg-slate-50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 prose-blockquote:italic"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-28 space-y-12">
              {/* Related Articles Component Placeholder */}
              <RelatedArticles currentSlug={slug} locale={locale} dict={dict} />

              {/* Newsletter or CTA */}
              <div className="p-8 rounded-[2rem] bg-slate-900 text-white space-y-4 shadow-2xl shadow-slate-900/20">
                <h4 className="text-lg font-bold leading-tight">
                  {dict.blog.cta.services}
                </h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  {dict.blog.cta.description}
                </p>
                <button className="w-full py-3 px-4 rounded-xl bg-myorange-100 text-white text-xs font-black uppercase tracking-widest hover:bg-myorange-200 transition-colors">
                  {dict.common.contactUs}
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

// Internal Helper Component for Related Articles
const RelatedArticles = async ({
  currentSlug,
  locale,
  dict,
}: {
  currentSlug: string;
  locale: Locale;
  dict: any;
}) => {
  const res = await blogServiceServer.getAll({
    status: 'published',
    locale,
    limit: 4,
  });

  const related = res.data.filter((p) => p.slug !== currentSlug).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
        {dict.blog.articles}
      </h3>
      <div className="space-y-6">
        {related.map((post) => (
          <a
            key={post.id}
            href={`/${locale}/blog/${post.slug}`}
            className="group block space-y-2"
          >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-myorange-100">
              <span>{formatDate(post.createdAt, locale)}</span>
              <span className="text-slate-300">•</span>
              <span>5 min</span>
            </div>
            <h4 className="font-bold text-slate-900 group-hover:text-myorange-100 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h4>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BlogPostPage;
