'use client';

import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';

type DbProject = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
};

type Props = {
  dict: Dictionary;
  locale: Locale;
  dbProjects?: DbProject[];
};

const getProjects = (dict: Dictionary) => [
  {
    id: 1,
    title: 'AlertJO.fr',
    description: dict.projects.items.alertjo.description,
    longDescription: dict.projects.items.alertjo.longDescription,
    technologies: [
      'Next.js',
      'TypeScript',
      'Drizzle ORM',
      'PostgreSQL',
      'Puppeteer',
    ],
    image: '/projects/alertjo.webp',
    github: undefined,
    live: 'https://alertjo.fr',
    featured: true,
    date: '2025',
    status: 'online',
    category: dict.projects.items.alertjo.category,
  },
  {
    id: 2,
    title: 'PCMGE.fr',
    description: dict.projects.items.pcmge.description,
    longDescription: dict.projects.items.pcmge.longDescription,
    technologies: ['Laravel', 'PHP', 'MySQL', 'Bootstrap'],
    image: '/projects/pcmge.webp',
    // github: 'https://github.com/mohamad-alkhatib/pcmge',
    live: 'https://pcmge.fr',
    featured: true,
    date: '2025',
    status: 'online',
    category: dict.projects.items.pcmge.category,
  },
  {
    id: 3,
    title: 'LuxDrive.de',
    description: dict.projects.items.luxdrive.description,
    longDescription: dict.projects.items.luxdrive.longDescription,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    image: '/projects/luxdrive.webp',
    github: undefined,
    live: 'https://luxdrive24.de',
    featured: true,
    date: '2025',
    status: 'online',
    category: dict.projects.items.luxdrive.category,
  },
  // {
  //   id: 3,
  //   title: 'Dashboard Analytics',
  //   description:
  //     'Tableau de bord interactif pour visualiser et analyser les données business en temps réel.',
  //   longDescription:
  //     'Interface de visualisation de données avec graphiques interactifs, rapports automatisés et intégrations API multiples pour le suivi des KPIs.',
  //   technologies: ['React', 'D3.js', 'Node.js', 'MongoDB', 'Chart.js'],
  //   image: '/projects/dashboard.jpg',
  //   github: 'https://github.com/mohamad-alkhatib/dashboard',
  //   live: 'https://dashboard-demo.mk-web.fr',
  //   featured: false,
  //   date: '2023',
  //   status: 'Terminé',
  //   category: 'Dashboard',
  // },
];

export default function LatestProjects({
  dict,
  locale,
  dbProjects = [],
}: Props) {
  const staticProjects = getProjects(dict);
  const projects =
    dbProjects.length > 0
      ? dbProjects.map((p, i) => ({
          id: p.id,
          title: p.title,
          description: p.description ?? '',
          longDescription: p.description ?? '',
          technologies: [] as string[],
          image: undefined as string | undefined,
          github: undefined as string | undefined,
          live: undefined as string | undefined,
          featured: i < 2,
          date: '',
          status: 'online' as const,
          category: '',
          slug: p.slug,
          fromDb: true,
        }))
      : staticProjects.map((p) => ({ ...p, fromDb: false as const, slug: '' }));

  const getStatusText = (status: string) => {
    if (status === 'online') return dict.projects.status.online;
    if (status === 'development') return dict.projects.status.development;
    return dict.projects.status.completed;
  };

  return (
    <section
      className="py-32 bg-white dark:bg-slate-950 relative"
      id="projects"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest mb-8 shadow-sm">
            <Calendar className="w-3.5 h-3.5 text-myorange-100" />
            {dict.projects.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-white mb-8 tracking-tight">
            {dict.projects.title}{' '}
            <span className="text-myorange-100">
              {dict.projects.titleHighlight}
            </span>
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            {dict.projects.subtitle}
          </p>
        </motion.div>

        {/* Bento-style Unified Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects
            .filter((p) => p.featured)
            .map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative bg-slate-50/50 dark:bg-slate-900/50 rounded-[2rem] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 transition-all duration-500 hover:bg-white dark:hover:bg-slate-900 hover:shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] dark:hover:shadow-none hover:border-myorange-100/20 dark:hover:border-myorange-100/30"
              >
                <div className="relative h-64 overflow-hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-600">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                      <span className="text-4xl font-bold text-slate-200 dark:text-slate-800 tracking-tighter">
                        MK
                      </span>
                    </div>
                  )}
                  <div className="absolute top-6 left-6 z-20">
                    <span className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-[9px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 shadow-sm">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-8">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-myorange-100 transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 line-clamp-2 text-sm font-medium leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-600">
                    <div className="flex gap-2">
                      {project.technologies.slice(0, 3).map((tech, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 hover:border-slate-900 dark:hover:border-white transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Other Projects Tiling */}
        {!!projects.filter((p) => !p.featured).length && (
          <div className="mt-24">
            <h3 className="text-sm font-mono uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-12 text-center">
              {dict.projects.otherProjects}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {projects
                .filter((p) => !p.featured)
                .map((project) => (
                  <div
                    key={project.id}
                    className="bg-slate-50/30 dark:bg-slate-900/30 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 hover:border-myorange-100/20 dark:hover:border-myorange-100/30 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-myorange-100 transition-colors">
                        {project.title}
                      </h4>
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-myorange-100 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <span className="text-[8px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500">
                      {project.category || 'Development'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
