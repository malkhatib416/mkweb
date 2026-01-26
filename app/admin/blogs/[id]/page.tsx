'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MarkdownRenderer } from '@/lib/markdown';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft, Edit } from 'lucide-react';
import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr-fetcher';
import { type Blog, type BlogResponse } from '@/lib/services/blog.service';

export default function ViewBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;

  const { data, error, isLoading } = useSWR<BlogResponse>(
    id ? `/api/admin/blogs/${id}` : null,
    fetcher,
  );

  const blog = data?.data;

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/blogs');
  }

  if (isLoading) {
    return <div className="text-center py-12">{t.loading}</div>;
  }

  if (!blog) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/blogs"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToBlogs}
        </Link>
        <Link href={`/admin/blogs/${id}/edit`}>
          <Button className="bg-myorange-100 hover:bg-myorange-200">
            <Edit className="mr-2 h-4 w-4" />
            {t.view.edit}
          </Button>
        </Link>
      </div>

      <article className="bg-white shadow rounded-lg p-8">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">{blog.title}</h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                blog.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {t.status[blog.status]}
            </span>
          </div>
          {blog.description && (
            <p className="text-xl text-gray-600 mb-4">{blog.description}</p>
          )}
          <div className="text-sm text-gray-500">
            <p>
              {t.metadata.slug}: {blog.slug}
            </p>
            <p>
              {t.metadata.created}: {new Date(blog.createdAt).toLocaleString()}
            </p>
            <p>
              {t.metadata.updated}: {new Date(blog.updatedAt).toLocaleString()}
            </p>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={blog.content} />
        </div>
      </article>
    </div>
  );
}
