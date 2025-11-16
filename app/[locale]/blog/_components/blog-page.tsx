'use client';

import { blogPosts } from '@/data';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import BlogCard from './blog-card';
import CategoryFilter from './category-filter';
import SearchBar from './search-bar';
import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';

type Props = {
  dict: Dictionary;
  locale: Locale;
};

export default function BlogPage({ dict, locale }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

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
  }, [searchTerm, selectedCategory]);

  return (
    <div className="min-h-[50vh] bg-white">
      {/* Minimal Header
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <a
              href="https://mk-web.fr"
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors text-sm"
            >
              ← Portfolio
            </a>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                <Code2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  MK Dev Blog
                </h1>
                <p className="text-gray-600">
                  Technical insights and development thoughts
                </p>
              </div>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content - Sidebar Layout */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar: Filters */}
          <aside className="lg:w-1/4 w-full mb-8 sm:mb-4 mt-12 lg:mb-0">
            <div className="sticky top-24 space-y-8">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder={dict.blog.search}
              />
              <CategoryFilter
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                allText={dict.blog.allCategories}
              />
            </div>
          </aside>

          {/* Blog Cards */}
          <section className="flex-1 lg:mt-12 sm:mt-8">
            {/* Results Count */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {filteredPosts.length === 0
                  ? dict.blog.noResults
                  : `${filteredPosts.length} ${filteredPosts.length === 1 ? dict.blog.article : dict.blog.articles}`}
              </h2>
              {searchTerm && (
                <p className="text-gray-600">
                  {dict.blog.resultsFor} "{searchTerm}"
                </p>
              )}
            </div>

            {/* Blog Posts - Vertical List */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 gap-8">
                {filteredPosts.map((post) => (
                  <BlogCard
                    key={post.id}
                    post={post}
                    locale={locale}
                    dict={dict}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {dict.blog.noResults}
                </h3>
                <p className="text-gray-600 max-w-sm mx-auto">
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
