import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { getDictionary } from '@/locales/dictionaries';
import { projectServiceServer } from '@/lib/services/project.service.server';
import Link from 'next/link';
import type { Locale } from '@/locales/i18n';

export default async function ProjectsListPage() {
  const locale = (await getLocaleFromHeaders()) as Locale;
  const dict = await getDictionary(locale);
  const projects = await projectServiceServer.getPublished(locale);

  const t = dict.projects ?? {
    title: 'Projects',
    subtitle: '',
    viewProject: 'View project',
  };
  const title = typeof t === 'object' && t.title ? t.title : 'Projects';
  const subtitle = typeof t === 'object' && t.subtitle ? t.subtitle : '';
  const viewProject =
    typeof t === 'object' && t.viewProject ? t.viewProject : 'View project';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
        {projects.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            Aucun projet publié.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((proj) => (
              <Link
                key={proj.id}
                href={`/${locale}/projects/${proj.slug}`}
                className="group rounded-2xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-6 shadow-sm transition-all hover:shadow-lg dark:hover:shadow-none hover:border-myorange-100/30 dark:hover:border-myorange-100/50"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-myorange-100 transition-colors">
                  {proj.title}
                </h2>
                {proj.description && (
                  <p className="mt-2 text-gray-600 dark:text-slate-400 line-clamp-2">
                    {proj.description}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center text-sm font-medium text-myorange-100 group-hover:underline">
                  {viewProject} →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
