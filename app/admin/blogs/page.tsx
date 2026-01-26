'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import Pagination from '@/components/admin/Pagination';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { blogService } from '@/lib/services/blog.service';
import { fetcher } from '@/lib/swr-fetcher';
import { Locale } from '@/locales/i18n';
import type { BlogListResponse, Status } from '@/types/entities';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR, { mutate } from 'swr';

export default function BlogsPage() {
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | Status>('all');
  const [localeFilter, setLocaleFilter] = useState<'all' | Locale>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const limit = 10;

  const buildUrl = () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (statusFilter !== 'all') {
      params.append('status', statusFilter);
    }
    if (localeFilter !== 'all') {
      params.append('locale', localeFilter);
    }
    return `/api/admin/blogs?${params.toString()}`;
  };

  const { data, error, isLoading } = useSWR<BlogListResponse>(
    buildUrl(),
    fetcher,
  );

  const blogs = data?.data || [];
  const total = data?.pagination.total || 0;

  if (error) {
    toast.error(t.fetchError);
  }

  const handleDeleteClick = (id: string, title: string) => {
    setItemToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      await blogService.delete(itemToDelete.id);
      toast.success(t.deleteSuccess);
      mutate(buildUrl());
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.deleteError);
      console.error(error);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t.title}</h1>
          <p className="mt-2 text-sm text-gray-600">{t.subtitle}</p>
        </div>
        <Link href="/admin/blogs/new">
          <Button className="bg-myorange-100 hover:bg-myorange-200">
            <Plus className="mr-2 h-4 w-4" />
            {t.newBlog}
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.status}
          </label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as 'all' | Status);
              setPage(1);
            }}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">{dict.admin.common.all || 'All'}</option>
            <option value="draft">{t.status.draft}</option>
            <option value="published">{t.status.published}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t.fields.locale}
          </label>
          <select
            value={localeFilter}
            onChange={(e) => {
              setLocaleFilter(e.target.value as 'all' | Locale);
              setPage(1);
            }}
            className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <option value="all">{dict.admin.common.all || 'All'}</option>
            <option value="fr">{t.locale.fr}</option>
            <option value="en">{t.locale.en}</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">{t.loading}</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{t.noBlogs}</p>
          <Link href="/admin/blogs/new">
            <Button className="mt-4 bg-myorange-100 hover:bg-myorange-200">
              {t.createFirst}
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {blogs.map((blog) => (
                <li key={blog.id}>
                  <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="text-lg font-medium text-gray-900">
                          {blog.title}
                        </h3>
                        <span
                          className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            blog.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {t.status[blog.status]}
                        </span>
                        <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {blog.locale.toUpperCase()}
                        </span>
                      </div>
                      {blog.description && (
                        <p className="mt-1 text-sm text-gray-500">
                          {blog.description}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {t.metadata.slug}: {blog.slug} • {t.metadata.created}:{' '}
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/admin/blogs/${blog.id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link href={`/admin/blogs/${blog.id}/edit`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(blog.id, blog.title)}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <Pagination
            currentPage={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
            itemName="blogs"
          />
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict.admin.common.delete}</AlertDialogTitle>
            <AlertDialogDescription>
              {itemToDelete &&
                t.deleteConfirm.replace('{title}', itemToDelete.title)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict.admin.common.cancel}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {dict.admin.common.delete}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
