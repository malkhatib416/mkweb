'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
    if (!slug || slug === '') {
      setSlug(generateSlug(value));
    }
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
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.createError);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t.backToProjects}
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t.create.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">{t.fields.title} *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder={t.placeholders.title}
          />
        </div>

        <div>
          <Label htmlFor="slug">{t.fields.slug} *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder={t.placeholders.slug}
            pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
          />
          <p className="mt-1 text-xs text-gray-500">{t.slugHelper}</p>
        </div>

        <div>
          <Label htmlFor="locale">{t.fields.locale} *</Label>
          <select
            id="locale"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            required
          >
            <option value="fr">{t.locale.fr}</option>
            <option value="en">{t.locale.en}</option>
          </select>
        </div>

        <div>
          <Label htmlFor="description">{t.fields.description}</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.placeholders.description}
          />
        </div>

        <div>
          <Label htmlFor="status">{t.fields.status} *</Label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="draft">{t.status.draft}</option>
            <option value="published">{t.status.published}</option>
          </select>
        </div>

        <div>
          <Label htmlFor="content">{t.fields.content} *</Label>
          <MarkdownEditor
            value={content}
            onChange={(value) => setContent(value || '')}
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Link href="/admin/projects">
            <Button type="button" variant="outline">
              {dict.admin.common.cancel}
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-myorange-100 hover:bg-myorange-200"
          >
            {isLoading ? t.create.creating : t.create.createButton}
          </Button>
        </div>
      </form>
    </div>
  );
}
