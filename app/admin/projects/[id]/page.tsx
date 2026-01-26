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
import type { Project, ProjectResponse } from '@/types/entities';
import type { Project, ProjectResponse } from '@/types/entities';

export default function ViewProjectPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.projects;

  const { data, error, isLoading } = useSWR<ProjectResponse>(
    id ? `/api/admin/projects/${id}` : null,
    fetcher,
  );

  const project = data?.data;

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/projects');
  }

  if (isLoading) {
    return <div className="text-center py-12">{t.loading}</div>;
  }

  if (!project) {
    return null;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/projects"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t.backToProjects}
        </Link>
        <Link href={`/admin/projects/${id}/edit`}>
          <Button className="bg-myorange-100 hover:bg-myorange-200">
            <Edit className="mr-2 h-4 w-4" />
            {t.view.edit}
          </Button>
        </Link>
      </div>

      <article className="bg-white shadow rounded-lg p-8">
        <header className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-gray-900">
              {project.title}
            </h1>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'published'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {t.status[project.status]}
            </span>
          </div>
          {project.description && (
            <p className="text-xl text-gray-600 mb-4">{project.description}</p>
          )}
          <div className="text-sm text-gray-500">
            <p>
              {t.metadata.slug}: {project.slug}
            </p>
            <p>
              {t.fields.locale}: {t.locale[project.locale]}
            </p>
            <p>
              {t.metadata.created}:{' '}
              {new Date(project.createdAt).toLocaleString()}
            </p>
            <p>
              {t.metadata.updated}:{' '}
              {new Date(project.updatedAt).toLocaleString()}
            </p>
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <MarkdownRenderer content={project.content} />
        </div>
      </article>
    </div>
  );
}
