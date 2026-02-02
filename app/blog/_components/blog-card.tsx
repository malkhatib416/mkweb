import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import { BlogPost } from '@/types';
import { formatDate } from '@/utils/format-date';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import type { BlogCategory } from './blog-page';

interface BlogCardProps {
  post: BlogPost;
  locale: Locale;
  dict: Dictionary;
  categories: BlogCategory[];
  variant?: 'vertical' | 'horizontal' | 'featured';
}

const BlogCard: React.FC<BlogCardProps> = ({
  post,
  locale,
  dict,
  categories,
  variant = 'vertical',
}) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${locale}/blog/${post.slug}`);
  };

  if (variant === 'featured') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer block w-full relative h-[60vh] min-h-[500px] overflow-hidden rounded-[3rem] shadow-2xl transition-all duration-500 hover:shadow-myorange-100/10"
      >
        {/* Single overlay for text contrast – no gradient */}
        <div className="absolute inset-0 bg-black/50 z-10" />

        {post.image ? (
          <img
            src={post.image}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}

        <div className="relative z-20 h-full flex items-center px-8 md:px-16 md:w-2/3">
          <div className="space-y-6">
            <span className="inline-block px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-myorange-100 text-white shadow-lg">
              {dict.blog.article} • {post.readTime} min
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight group-hover:text-myorange-50 transition-colors">
              {post.title}
            </h2>
            <p className="text-lg text-white/70 line-clamp-3 max-w-xl">
              {post.description}
            </p>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex items-center gap-2 text-white">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <User className="h-4 w-4" />
                </div>
                <span className="text-sm font-bold uppercase tracking-widest text-white/80">
                  {post.author}
                </span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-bold uppercase tracking-widest">
                  {formatDate(post.publishedAt, locale)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article
        onClick={handleClick}
        className="group cursor-pointer flex gap-6 items-center p-4 rounded-3xl transition-all duration-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent hover:border-slate-100 dark:hover:border-slate-700"
      >
        <div className="relative w-32 h-32 md:w-48 md:h-32 shrink-0 overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-200 dark:text-slate-600 font-black">
              MK
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-myorange-100">
            <span>{formatDate(post.publishedAt, locale)}</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span>{post.readTime} min</span>
          </div>
          <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-myorange-100 transition-colors">
            {post.title}
          </h3>
          <p className="hidden md:block text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
            {post.description}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article
      onClick={handleClick}
      className="group cursor-pointer block h-full"
    >
      <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm transition-all duration-300 hover:shadow-xl dark:hover:shadow-none hover:-translate-y-1 hover:border-myorange-100/10 dark:hover:border-myorange-100/20">
        {/* Cover Image */}
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          {post.image ? (
            <img
              src={post.image}
              alt={post.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
              <span className="text-slate-200 dark:text-slate-600 text-6xl font-black opacity-10 select-none">
                MK
              </span>
            </div>
          )}

          {/* Categories Overlay */}
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {post.categories.slice(0, 1).map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              return category ? (
                <span
                  key={categoryId}
                  style={
                    category.color
                      ? parseCategoryColor(category.color)
                      : undefined
                  }
                  className={
                    category.color
                      ? 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm'
                      : 'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-sm'
                  }
                >
                  {category.name}
                </span>
              ) : null;
            })}
          </div>
        </div>

        <div className="flex flex-col flex-1 p-8">
          {/* Meta Info Top */}
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            <div className="flex items-center gap-1.5">
              <User className="h-3 w-3" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-1.5 text-myorange-100">
              <Clock className="h-3 w-3" />
              <span>{post.readTime} min</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-myorange-100 transition-colors">
            {post.title}
          </h2>

          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50 dark:border-slate-800">
            <time className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {formatDate(post.publishedAt, locale)}
            </time>

            {/* Read More */}
            <div className="flex items-center text-xs font-bold uppercase tracking-widest text-myorange-100 group-hover:gap-3 transition-all">
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

// Helper to parse color string from data/index.ts
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
