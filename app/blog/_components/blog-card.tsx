import { categories } from '@/data';
import { BlogPost } from '@/types';
import { ArrowRight, Clock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/blog/${post.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <article onClick={handleClick} className="group cursor-pointer block">
      <div className="border border-gray-200 rounded-2xl p-6 h-full hover:border-gray-300 transition-all duration-200 hover:shadow-sm bg-white">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.slice(0, 2).map((categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            return category ? (
              <span
                key={categoryId}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {category.name}
              </span>
            ) : null;
          })}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
          {post.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-sm">
          {post.description}
        </p>

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{post.readTime}m</span>
            </div>
          </div>
          <time className="text-gray-400">{formatDate(post.publishedAt)}</time>
        </div>

        {/* Read More */}
        <div className="flex items-center text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
          <span>Read article</span>
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
