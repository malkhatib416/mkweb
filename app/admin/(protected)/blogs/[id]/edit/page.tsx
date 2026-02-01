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
import { useBlog } from '@/lib/hooks/use-blog';
import { blogService } from '@/lib/services/blog.service';
import { fetcher } from '@/lib/swr-fetcher';
import { Locale } from '@/locales/i18n';
import type { CategoryListResponse, Status } from '@/types/entities';
import {
  ArrowLeft,
  ImagePlus,
  RefreshCw,
  Sparkles,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = (params?.id as string) ?? null;
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;

  const { blog, error, isLoading: isFetching } = useBlog(id);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState<Locale>('fr');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [categoryId, setCategoryId] = useState<string>('');
  const [readingTime, setReadingTime] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: categoriesData } = useSWR<CategoryListResponse>(
    '/api/admin/categories',
    fetcher,
  );
  const categories = categoriesData?.data ?? [];

  React.useEffect(() => {
    if (blog && !isInitialized) {
      setTitle(blog.title);
      setSlug(blog.slug);
      setLocale(blog.locale);
      setDescription(blog.description || '');
      setImage((blog as { image?: string | null }).image ?? '');
      setContent(blog.content);
      setStatus(blog.status);
      setCategoryId((blog as { categoryId?: string | null }).categoryId ?? '');
      const rt = (blog as { readingTime?: number | null }).readingTime;
      setReadingTime(rt != null ? rt : '');
      setIsInitialized(true);
    }
  }, [blog, isInitialized]);

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/blogs');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setIsLoading(true);
    try {
      await blogService.update(id, {
        title,
        slug,
        locale,
        description: description || null,
        image: image || undefined,
        content,
        status,
        categoryId: categoryId || undefined,
        readingTime: typeof readingTime === 'number' ? readingTime : undefined,
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

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const { url } = await blogService.generateImage(title, description);
      if (url) setImage(url);
      toast.success(t.generateImage?.success ?? 'Image generated');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : (t.generateImage?.error ?? 'Failed to generate image'),
      );
      console.error(err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleUploadImageClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      const res = await fetch('/api/admin/upload/blog-cover', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok)
        throw new Error(
          json.error || (t.uploadImage?.error ?? 'Upload failed'),
        );
      if (json.url) setImage(json.url);
      toast.success(t.uploadImage?.success ?? 'Image uploaded');
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : (t.uploadImage?.error ?? 'Upload failed'),
      );
      console.error(err);
    } finally {
      setIsUploadingImage(false);
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

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-3"
      >
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold">
                  {t.fields.title} *
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder={t.placeholders.title}
                  className="text-lg font-medium"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">
                  {t.fields.slug} *
                </Label>
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

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  {t.fields.description}
                </Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t.placeholders.description}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">
                  {t.fields.content} *
                </Label>
                <MarkdownEditor
                  value={content}
                  onChange={(value) => setContent(value || '')}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Cover Photo Card */}
          <Card className="overflow-hidden border-none shadow-lg">
            <div className="bg-muted px-4 py-3 border-b border-border/50">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                {t.fields.image || 'Cover Photo'}
              </h2>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-muted ring-1 ring-border/50">
                {image ? (
                  <>
                    <Image
                      src={image}
                      alt="Preview"
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleUploadImageClick}
                        className="h-8 gap-1.5"
                      >
                        <Upload className="h-3.5 w-3.5" />
                        {dict.admin?.common?.save || 'Save'}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                    <ImagePlus className="h-10 w-10 mb-2 opacity-20" />
                    <p className="text-xs font-medium text-center px-4 leading-relaxed">
                      {t.generateImage?.hint || 'No image selected'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder={t.placeholders.imageUrl}
                    className="h-9 text-xs"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    disabled={isUploadingImage}
                    onClick={handleUploadImageClick}
                    className="h-9 w-9 shrink-0"
                  >
                    {isUploadingImage ? (
                      <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isGeneratingImage}
                  onClick={handleGenerateImage}
                  className="w-full h-9 gap-2 border-dashed border-myorange-100/50 text-myorange-100 hover:bg-myorange-100/5"
                >
                  {isGeneratingImage ? (
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="h-3.5 w-3.5" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {t.generateImage?.button || 'Generate AI Image'}
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="border-none shadow-lg">
            <div className="bg-muted px-4 py-3 border-b border-border/50">
              <h2 className="text-sm font-bold uppercase tracking-wider text-foreground/70">
                {dict.admin?.sidebar?.blogs ?? 'Settings'}
              </h2>
            </div>
            <CardContent className="p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  {t.fields.status} *
                </Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as Status)}
                >
                  <SelectTrigger className="h-10">
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

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  {t.fields.locale} *
                </Label>
                <Select
                  value={locale}
                  onValueChange={(v) => setLocale(v as Locale)}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">{t.locale.fr}</SelectItem>
                    <SelectItem value="en">{t.locale.en}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider opacity-70">
                  {t.fields.category}
                </Label>
                <Select
                  value={categoryId || '__none__'}
                  onValueChange={(v) =>
                    setCategoryId(v === '__none__' ? '' : v)
                  }
                >
                  <SelectTrigger className="h-10">
                    <SelectValue
                      placeholder={dict.admin?.common?.all ?? 'All'}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">
                      {dict.admin?.common?.all ?? '—'}
                    </SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="readingTime"
                  className="text-xs font-semibold uppercase tracking-wider opacity-70"
                >
                  {t.fields.readingTime ?? 'Reading time (min)'}
                </Label>
                <Input
                  id="readingTime"
                  type="number"
                  min={1}
                  max={120}
                  value={readingTime === '' ? '' : readingTime}
                  onChange={(e) => {
                    const v = e.target.value;
                    setReadingTime(
                      v === ''
                        ? ''
                        : Math.max(1, Math.min(120, parseInt(v, 10) || 1)),
                    );
                  }}
                  placeholder="—"
                  className="h-10"
                />
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-myorange-100 hover:bg-myorange-200 shadow-lg shadow-myorange-100/20"
                >
                  {isLoading ? t.edit.updating : t.edit.updateButton}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  asChild
                  className="w-full"
                >
                  <Link href="/admin/blogs">{dict.admin.common.cancel}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
