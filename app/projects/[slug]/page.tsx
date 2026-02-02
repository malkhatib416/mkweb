import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { getDictionary } from '@/locales/dictionaries';
import { projectServiceServer } from '@/lib/services/project.service.server';
import { MarkdownRenderer } from '@/lib/markdown';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '@/locales/i18n';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const locale = (await getLocaleFromHeaders()) as Locale;
  const dict = await getDictionary(locale);
  const project = await projectServiceServer.getPublishedBySlug(slug, locale);

  if (!project) return notFound();

  const t = dict.projects ?? {
    viewProject: 'View project',
    backToHome: 'Back',
  };
  const backLabel = dict.common?.backToHome ?? 'Back to home';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Link
          href={`/${locale}/projects`}
          className="text-sm text-muted-foreground hover:text-myorange-100 mb-6 inline-block"
        >
          ← {backLabel}
        </Link>
        <article>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>
          {project.description && (
            <p className="text-xl text-gray-600 mb-8">{project.description}</p>
          )}
          <div className="prose prose-slate max-w-none dark:prose-invert">
            <MarkdownRenderer content={project.content} />
          </div>
        </article>
      </div>
    </div>
  );
}
