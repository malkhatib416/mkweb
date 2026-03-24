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
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
      />

      <ArticleHero
        blog={blog}
        dict={dict}
        locale={locale}
        publishedAt={publishedAt}
      />

      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-28 pb-24">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Description */}
            {blog.description && (
              <div className="mb-16">
                <p className="text-2xl md:text-3xl text-slate-400 dark:text-slate-500 font-medium leading-relaxed italic border-l-4 border-myorange-100 pl-8">
                  {blog.description}
                </p>
              </div>
            )}

            {/* Markdown Content */}
            <div className="prose-container">
              <MarkdownRenderer
                content={blog.content}
                className="prose prose-slate dark:prose-invert prose-lg max-w-none 
                  prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                  prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                  prose-a:text-myorange-100 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-3xl prose-img:shadow-2xl
                  prose-strong:text-slate-900 dark:prose-strong:text-white
                  prose-blockquote:border-myorange-100 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:text-slate-700 dark:prose-blockquote:text-slate-300 prose-blockquote:italic"
              />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="sticky top-28 space-y-12">
              {/* Related Articles Component Placeholder */}
              <RelatedArticles currentSlug={slug} locale={locale} dict={dict} />

              {/* Newsletter or CTA */}
              <div className="p-8 rounded-[2rem] bg-slate-900 dark:bg-slate-800 text-white space-y-4 shadow-2xl shadow-slate-900/20 dark:shadow-black/30 border border-slate-800 dark:border-slate-700">
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

type ArticleHeroProps = {
  blog: Awaited<ReturnType<typeof blogServiceServer.getBySlug>>['data'];
  dict: Awaited<ReturnType<typeof getDictionary>>;
  locale: Locale;
  publishedAt: string;
};

const ArticleHero = ({ blog, dict, locale, publishedAt }: ArticleHeroProps) => {
  return (
    <section className="relative pb-10 md:pb-14">
      <div className="relative h-[54vh] min-h-[360px] sm:min-h-[420px] md:min-h-[500px] overflow-hidden">
        {blog.image ? (
          <img
            src={blog.image}
            alt={blog.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
        <div className="absolute inset-0 z-10 bg-black/25" />
        <div
          className="absolute inset-0 z-10 bg-gradient-to-t from-white via-white/25 to-transparent dark:from-slate-950 dark:via-slate-950/35 dark:to-transparent"
          aria-hidden
        />
      </div>

      <div className="mx-auto -mt-20 md:-mt-28 max-w-6xl px-6 relative z-20">
        <div className="rounded-[2.25rem] border border-white/60 bg-white/90 p-6 shadow-[0_24px_60px_-24px_rgba(2,6,23,0.45)] backdrop-blur-md dark:border-slate-800 dark:bg-slate-900 md:p-10">
          <div className="max-w-4xl space-y-6">
            <div className="flex items-center gap-3">
              {blog.category && (
                <span className="rounded-full bg-myorange-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  {blog.category.name}
                </span>
              )}
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                {dict.blog.article}
              </span>
            </div>

            <h1 className="max-w-[22ch] text-[clamp(2rem,4.2vw,4.25rem)] font-black leading-[1.08] tracking-tight text-slate-900 dark:text-white [overflow-wrap:anywhere]">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-x-10 gap-y-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-700">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    {dict.blog.meta.author}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    MK-Web
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {dict.blog.meta.published}
                </span>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-myorange-100" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {formatDate(publishedAt, locale)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {dict.blog.meta.readTime}
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-myorange-100" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    {(blog as { readingTime?: number | null }).readingTime ?? 5}{' '}
                    {dict.blog.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
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
      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
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
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span>
                5 {dict.blog.readTime}
              </span>
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h4>
          </a>
        ))}
      </div>
    </div>
  );
};

export default BlogPostPage;
