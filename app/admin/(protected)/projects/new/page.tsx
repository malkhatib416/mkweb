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
import { projectService } from '@/lib/services/project.service';
import { Locale } from '@/locales/i18n';
import { Status } from '@/types/entities';
import { generateSlug } from '@/utils/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewProjectPage() {
  const router = useRouter();
  const dict = useAdminDictionary();
  const t = dict.admin.projects;
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [locale, setLocale] = useState<Locale>('fr');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<Status>('draft');
  const [isLoading, setIsLoading] = useState(false);

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === '') setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await projectService.create({
        title,
        slug,
        locale,
        description: description || null,
        content,
        status,
      });
      toast.success(t.createSuccess);
      router.push('/admin/projects');
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
        href="/admin/projects"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToProjects}
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
                <Link href="/admin/projects">{dict.admin.common.cancel}</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-myorange-100 hover:bg-myorange-100/90"
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
