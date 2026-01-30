'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { blogService } from '@/lib/services/blog.service';
import { Locale } from '@/locales/i18n';
import { Status } from '@/types/entities';
import { generateSlug } from '@/utils/utils';
import { ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewBlogPage() {
  const router = useRouter();
  const dict = useAdminDictionary();
  const t = dict.admin.blogs;
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState<Locale>('fr');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
    try {
      const res = await fetch('/api/admin/blogs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || t.generateWithAI.errorMessage);
      const count = json.data?.created?.length ?? 0;
      toast.success(
        t.generateWithAI.successMessage.replace('{count}', String(count)),
      );
      router.push('/admin/blogs');
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : t.generateWithAI.errorMessage,
      );
      console.error(err);
    } finally {
      setIsGenerating(false);
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
        content,
        status,
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

      <Card>
        <CardContent className="pt-6">
          <h2 className="mb-2 flex items-center gap-2 text-lg font-medium text-foreground">
            <Sparkles className="h-5 w-5 text-myorange-100" />
            {t.generateWithAI.title}
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {t.generateWithAI.description}
          </p>
          <form
            onSubmit={handleGenerateWithAI}
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
          >
            <div className="min-w-0 flex-1 space-y-2">
              <Label htmlFor="ai-topic">{t.generateWithAI.topicLabel}</Label>
              <Input
                id="ai-topic"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder={t.generateWithAI.topicPlaceholder}
                disabled={isGenerating}
              />
            </div>
            <Button
              type="submit"
              disabled={isGenerating || !aiTopic.trim()}
              variant="outline"
              className="gap-1.5 border-myorange-100 text-myorange-100 hover:bg-myorange-100/10 hover:text-myorange-100 sm:shrink-0"
            >
              <Sparkles className="h-4 w-4" />
              {isGenerating
                ? t.generateWithAI.generating
                : t.generateWithAI.generateButton}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">{t.fields.title} *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
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
                {isLoading ? t.create.creating : t.create.createButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
