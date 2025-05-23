import { blogPosts, categories } from '@/data';
import { notFound } from 'next/navigation';
import { User, Calendar, Clock } from 'lucide-react';
import React from 'react';

interface BlogPostPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

const BlogPostPage = ({ params }: BlogPostPageProps) => {
  const post = blogPosts.find((p) => p.id === params.id);
  if (!post) return notFound();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-white lg:mt-12 sm:mt-20">
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
            <span className="text-sm">{post.readTime} min de lecture</span>
          </div>
        </div>
        {/* Description */}
        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {post.description}
        </p>
        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
