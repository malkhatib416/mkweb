'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { blogService } from '@/lib/services/blog.service';
import { fetcher } from '@/lib/swr-fetcher';
import { Locale } from '@/locales/i18n';
import type { BlogResponse, Status } from '@/types/entities';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;

  const {
    data,
    error,
    isLoading: isFetching,
  } = useSWR<BlogResponse>(id ? `/api/admin/blogs/${id}` : null, fetcher);

  const blog = data?.data;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState<Locale>('fr');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (blog && !isInitialized) {
      setTitle(blog.title);
      setSlug(blog.slug);
      setLocale(blog.locale);
      setDescription(blog.description || '');
      setContent(blog.content);
      setStatus(blog.status);
      setIsInitialized(true);
    }
  }, [blog, isInitialized]);

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/blogs');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await blogService.update(id, {
        title,
        slug,
        locale,
        description: description || null,
        content,
        status,
      });
      toast.success(t.updateSuccess);
      router.push('/admin/blogs');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.updateError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="rounded-lg border border-border bg-card py-16">
        <Loading label={t.loading} />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin/blogs"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToBlogs}
      </Link>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {t.edit.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {blog.title}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t.fields.title} *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder={t.placeholders.title}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">{t.fields.slug} *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder={t.placeholders.slug}
                pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
              />
              <p className="text-xs text-muted-foreground">{t.slugHelper}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>{t.fields.locale} *</Label>
                <Select
                  value={locale}
                  onValueChange={(v) => setLocale(v as Locale)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{t.locale.fr}</SelectItem>
                    <SelectItem value="en">{t.locale.en}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.fields.status} *</Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Status)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{t.status.draft}</SelectItem>
                    <SelectItem value="published">
                      {t.status.published}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t.fields.description}</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.placeholders.description}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.fields.content} *</Label>
              <MarkdownEditor
                value={content}
                onChange={(value) => setContent(value || '')}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/blogs">{dict.admin.common.cancel}</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-myorange-100 hover:bg-myorange-200"
              >
                {isLoading ? t.edit.updating : t.edit.updateButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
