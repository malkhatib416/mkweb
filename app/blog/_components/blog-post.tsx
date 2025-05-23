import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';
import { blogPosts, categories } from '../data/blogData';

const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = blogPosts.find((p) => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Post not found
          </h1>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to blog</span>
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to articles</span>
          </button>

          <a
            href="https://mk-web.fr"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Portfolio →
          </a>
        </div>

        <article className="max-w-3xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.categories.map((categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              return category ? (
                <span
                  key={categoryId}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                >
                  {category.name}
                </span>
              ) : null;
            })}
          </div>

          {/* Title */}
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
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
              <span className="text-sm">{post.readTime} min read</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.description}
            </p>

            <div className="text-gray-700 leading-relaxed space-y-6">
              {post.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="text-lg leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Back to Blog */}
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-gray-100">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Read more articles</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
