'use client';

import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import type { BlogPost } from '@/types';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import BlogCard from './blog-card';
import CategoryFilter from './category-filter';
import SearchBar from './search-bar';

export type BlogCategory = { id: string; name: string; color?: string };

type Props = {
  dict: Dictionary;
  locale: Locale;
  posts: BlogPost[];
  categories: BlogCategory[];
};

export default function BlogPage({ dict, locale, posts, categories }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.categories.some((cat) =>
            cat.toLowerCase().includes(searchTerm.toLowerCase()),
          ),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) =>
        post.categories.includes(selectedCategory),
      );
    }

    return filtered.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [searchTerm, selectedCategory, posts]);

  const featuredPost = useMemo(() => filteredPosts[0], [filteredPosts]);
  const secondaryPosts = useMemo(() => filteredPosts.slice(1), [filteredPosts]);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors">
      {/* Editorial Header - Featured Post */}
      {featuredPost && !searchTerm && !selectedCategory && (
        <section className="relative px-6 pt-32 pb-16">
          <div className="max-w-6xl mx-auto">
            <BlogCard
              post={featuredPost}
              locale={locale}
              dict={dict}
              categories={categories}
              variant="featured"
            />
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Sidebar: Navigation & Filters */}
          <aside className="lg:w-1/4 w-full order-2 lg:order-1">
            <div className="sticky top-28 space-y-12">
              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {dict.blog.search}
                </h3>
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder={dict.blog.search}
                />
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                  {dict.blog.categories}
                </h3>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  allText={dict.blog.allCategories}
                />
              </div>

              {/* Newsletter or CTA placeholder */}
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

          {/* Blog Feed */}
          <section className="flex-1 order-1 lg:order-2">
            {!featuredPost && (
              <div className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                  {dict.blog.title}
                </h1>
                <p className="text-slate-500 dark:text-slate-400">
                  {dict.blog.description}
                </p>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-end justify-between mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {searchTerm || selectedCategory ? (
                    <>
                      {dict.blog.resultsFor}{' '}
                      <span className="text-myorange-100 italic">
                        "
                        {searchTerm ||
                          (selectedCategory &&
                            categories.find((c) => c.id === selectedCategory)
                              ?.name)}
                        "
                      </span>
                    </>
                  ) : (
                    dict.blog.articles
                  )}
                </h2>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-2">
                  {filteredPosts.length} {dict.blog.articles}
                </p>
              </div>
            </div>

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {(searchTerm || selectedCategory
                  ? filteredPosts
                  : secondaryPosts
                ).map((post) => (
                  <div key={post.id} className="h-full">
                    <BlogCard
                      post={post}
                      locale={locale}
                      dict={dict}
                      categories={categories}
                      variant="vertical"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 rounded-[3rem] bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                  {dict.blog.noResults}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  {dict.blog.noResultsDescription}
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
