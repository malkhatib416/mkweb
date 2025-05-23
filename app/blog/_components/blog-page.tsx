'use client';
import { blogPosts } from '@/data';
import { Code2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import SearchBar from './search-bar';
import CategoryFilter from './category-filter';
import BlogCard from './blog-card';

export default function BlogPage() {
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
    <div className="min-h-screen bg-white">
      {/* Minimal Header */}
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
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Search and Filters - Horizontal Layout */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          <div className="lg:w-96">
            <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {/* Results Count */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {filteredPosts.length === 0
              ? 'No articles found'
              : `${filteredPosts.length} ${filteredPosts.length === 1 ? 'Article' : 'Articles'}`}
          </h2>
          {searchTerm && (
            <p className="text-gray-600">Results for "{searchTerm}"</p>
          )}
        </div>

        {/* Blog Posts - Masonry-like Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 max-w-sm mx-auto">
              Try adjusting your search terms or browse all categories
            </p>
          </div>
        )}
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-gray-100 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-600 text-sm">© 2024 MK Web Development</p>
            <a
              href="https://mk-web.fr"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Visit Portfolio →
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
