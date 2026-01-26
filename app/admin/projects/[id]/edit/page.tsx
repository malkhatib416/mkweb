'use client';

import { useState } from 'react';
import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import useSWR from 'swr';
import { fetcher } from '@/lib/swr-fetcher';
import {
  projectService,
  type Project,
  type ProjectResponse,
} from '@/lib/services/project.service';

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.projects;

  const {
    data,
    error,
    isLoading: isFetching,
  } = useSWR<ProjectResponse>(id ? `/api/admin/projects/${id}` : null, fetcher);

  const project = data?.data;

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update form fields when project data is loaded
  React.useEffect(() => {
    if (project && !isInitialized) {
      setTitle(project.title);
      setSlug(project.slug);
      setDescription(project.description || '');
      setContent(project.content);
      setStatus(project.status);
      setIsInitialized(true);
    }
  }, [project, isInitialized]);

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/projects');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await projectService.update(id, {
        title,
        slug,
        description: description || null,
        content,
        status,
      });

      toast.success(t.updateSuccess);
      router.push('/admin/projects');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t.updateError);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="text-center py-12">{t.loading}</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t.backToProjects}
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{t.edit.title}</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">{t.fields.title} *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
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
            onChange={(e) => setStatus(e.target.value as 'draft' | 'published')}
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
            {isLoading ? t.edit.updating : t.edit.updateButton}
          </Button>
        </div>
      </form>
    </div>
  );
}
