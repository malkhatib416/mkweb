import { categories } from '@/data';
import { getBlogPostById, getBlogPostSlugs } from '@/lib/mdx';
import { notFound } from 'next/navigation';
import { User, Calendar, Clock } from 'lucide-react';
import React, { use } from 'react';
import dynamic from 'next/dynamic';

interface BlogPostPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ id: slug }));
}

const BlogPostPage = ({ params }: BlogPostPageProps) => {
  const { id } = use(params);
  const post = use(getBlogPostById(id));

  if (!post) return notFound();

  // Dynamically import the MDX file
  const MDXContent = dynamic(() => import(`@/content/blog/${id}.mdx`));

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
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
            <span className="text-sm">{post.readTime} min de lecture</span>
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
