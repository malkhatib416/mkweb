'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { blogService } from '@/lib/services/blog.service';
import { fetcher } from '@/lib/swr-fetcher';
import { Locale } from '@/locales/i18n';
import type { CategoryListResponse } from '@/types/entities';
import { Status } from '@/types/entities';
import { generateSlug } from '@/utils/utils';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileEdit,
  ImagePlus,
  Plus,
  RefreshCw,
  Sparkles,
  Upload,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

type CreatedArticle = { id: string; locale: string; title: string };

export default function NewBlogPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;
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
  const [aiTopic, setAiTopic] = useState('');

  const { data: categoriesData } = useSWR<CategoryListResponse>(
    '/api/admin/categories',
    fetcher,
  );
  const categories = categoriesData?.data ?? [];

  useEffect(() => {
    const topic = searchParams.get('topic');
    if (topic?.trim()) setAiTopic(decodeURIComponent(topic.trim()));
  }, [searchParams]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCreated, setGeneratedCreated] = useState<
    CreatedArticle[] | null
  >(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === '') setSlug(generateSlug(value));
  };

  const handleGenerateWithAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      toast.error(t.generateWithAI.topicLabel);
      return;
    }
    setIsGenerating(true);
    setGeneratedCreated(null);
    try {
      const res = await fetch('/api/admin/blogs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t.generateWithAI.errorMessage);
      const created: CreatedArticle[] = json.data?.created ?? [];
      setGeneratedCreated(created);
      toast.success(
        t.generateWithAI.successMessage.replace(
          '{count}',
          String(created.length),
        ),
      );
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t.generateWithAI.errorMessage,
      );
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateAnother = () => {
    setGeneratedCreated(null);
    setAiTopic('');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await blogService.create({
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
      toast.success(t.createSuccess);
      router.push('/admin/blogs');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.createError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
          {t.create.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {t.subtitle}
        </h1>
      </div>

      {/* Generate with AI — primary path */}
      <Card className="overflow-hidden border-none bg-gradient-to-br from-card to-muted/20 shadow-xl">
        <div className="bg-myorange-100/5 px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-myorange-100 text-white shadow-lg shadow-myorange-100/20">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold tracking-tight">
                  {t.generateWithAI.title}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground/80">
                  {t.generateWithAI.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="px-6 pb-8 sm:px-8">
          {generatedCreated ? (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm"
              >
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-bold text-foreground">
                    {t.generateWithAI.successTitle}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t.generateWithAI.successDescription}
                  </p>
                </div>
              </motion.div>
              <div className="grid gap-3 sm:grid-cols-2">
                {generatedCreated.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={`/admin/blogs/${a.id}/edit`}
                      className="group flex items-center justify-between rounded-xl border border-border/50 bg-background/50 p-4 transition-all hover:border-myorange-100/30 hover:bg-background hover:shadow-md dark:bg-muted/20"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-myorange-100/10 group-hover:text-myorange-100 transition-colors">
                          <FileEdit className="h-4 w-4" />
                        </div>
                        <span className="truncate text-sm font-semibold text-foreground group-hover:text-myorange-100 transition-colors">
                          {a.title}
                        </span>
                      </div>
                      <span className="ml-2 rounded-lg bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        {a.locale}
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-4 border-t border-border/50">
                <Button
                  asChild
                  className="bg-myorange-100 hover:bg-myorange-200 shadow-lg shadow-myorange-100/20"
                >
                  <Link href="/admin/blogs?status=draft">
                    <Eye className="mr-2 h-4 w-4" />
                    {t.generateWithAI.viewDrafts}
                  </Link>
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCreateAnother}
                  className="gap-2 border-border text-foreground hover:bg-myorange-100/5"
                >
                  <Plus className="h-4 w-4" />
                  {t.generateWithAI.createAnother}
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGenerateWithAI} className="space-y-4">
              <div className="space-y-3">
                <Label
                  htmlFor="ai-topic"
                  className="text-xs font-bold uppercase tracking-wider opacity-70"
                >
                  {t.generateWithAI.topicLabel}
                </Label>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                  <div className="relative flex-1">
                    <Input
                      id="ai-topic"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      placeholder={t.generateWithAI.topicPlaceholder}
                      disabled={isGenerating}
                      className="h-12 pl-4 text-sm focus:ring-myorange-100"
                    />
                    {isGenerating && (
                      <div className="absolute right-3 top-3.5">
                        <RefreshCw className="h-5 w-5 animate-spin text-myorange-100" />
                      </div>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isGenerating || !aiTopic.trim()}
                    className="h-12 gap-2 bg-myorange-100 px-6 font-bold hover:bg-myorange-200 lg:shrink-0 shadow-lg shadow-myorange-100/20"
                  >
                    {!isGenerating && <Sparkles className="h-4 w-4" />}
                    {isGenerating
                      ? t.generateWithAI.generating
                      : t.generateWithAI.generateButton}
                  </Button>
                </div>
                {isGenerating && (
                  <p className="text-xs font-medium text-myorange-100 animate-pulse">
                    {t.generateWithAI.generatingHint}
                  </p>
                )}
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      <Separator className="my-2" />

      {/* Or create manually — secondary path */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t.generateWithAI.orCreateManually}
          </p>
          <Separator className="flex-1" />
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
                    onChange={(e) => handleTitleChange(e.target.value)}
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
                  <p className="text-xs text-muted-foreground">
                    {t.slugHelper}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-semibold"
                  >
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
                    {isLoading ? t.create.creating : t.create.createButton}
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
    </div>
  );
}
