'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

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
    key: 'alertjo' as const,
    id: 1,
    title: 'AlertJO.fr',
    description: dict.projects.items.alertjo.description,
    longDescription: dict.projects.items.alertjo.longDescription,
    tasks: dict.projects.items.alertjo.tasks,
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
    key: 'pcmge' as const,
    id: 2,
    title: 'PCMGE.fr',
    description: dict.projects.items.pcmge.description,
    longDescription: dict.projects.items.pcmge.longDescription,
    tasks: dict.projects.items.pcmge.tasks,
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
    key: 'luxdrive' as const,
    id: 3,
    title: 'LuxDrive.de',
    description: dict.projects.items.luxdrive.description,
    longDescription: dict.projects.items.luxdrive.longDescription,
    tasks: dict.projects.items.luxdrive.tasks,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'Stripe'],
    image: '/projects/luxdrive.webp',
    github: undefined,
    live: 'https://luxdrive24.de',
    featured: true,
    date: '2025',
    status: 'online',
    category: dict.projects.items.luxdrive.category,
  },
  {
    key: 'loiselet' as const,
    id: 4,
    title: 'Loiselet.com',
    description: dict.projects.items.loiselet.description,
    longDescription: dict.projects.items.loiselet.longDescription,
    tasks: dict.projects.items.loiselet.tasks,
    technologies: ['Next.js', 'TypeScript', 'PostgreSQL', 'AI'],
    image: '/projects/loiselet.webp',
    github: undefined,
    live: 'https://loiselet.com',
    featured: false,
    date: '2025',
    status: 'online',
    category: dict.projects.items.loiselet.category,
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

export default function LatestProjects(props: Props) {
  const { dict, dbProjects = [] } = props;
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | number | null
  >(null);
  const staticProjects = getProjects(dict);
  const labels = dict.projects.labels;
  const projects =
    dbProjects.length > 0
      ? dbProjects.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description ?? '',
          longDescription: p.description ?? '',
          tasks: [] as string[],
          technologies: [] as string[],
          image: undefined as string | undefined,
          github: undefined as string | undefined,
          live: undefined as string | undefined,
          date: '',
          status: 'online' as const,
          category: '',
          slug: p.slug,
          key: p.slug as 'alertjo',
          fromDb: true,
        }))
      : staticProjects.map((p) => ({ ...p, fromDb: false as const, slug: '' }));

  const selectedProject =
    projects.find((project) => project.id === selectedProjectId) ?? null;

  return (
    <Sheet
      open={Boolean(selectedProject)}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedProjectId(null);
        }
      }}
    >
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

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.button
                key={project.id}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                onClick={() => setSelectedProjectId(project.id)}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200/60 bg-slate-50/50 text-left transition-all duration-500 hover:border-myorange-100/20 hover:bg-white hover:shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-myorange-100 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-myorange-100/30 dark:hover:bg-slate-900 dark:hover:shadow-none"
                aria-label={`${labels.drawerHint}: ${project.title}`}
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
                        onClick={(event) => event.stopPropagation()}
                        aria-label={`${dict.projects.visitLiveSite}: ${project.title}`}
                        className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-950 hover:border-slate-900 dark:hover:border-white transition-all duration-300"
                      >
                        <ExternalLink className="w-4 h-4" aria-hidden />
                      </a>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-slate-200 bg-white p-0 text-left dark:border-slate-800 dark:bg-slate-950 sm:max-w-2xl"
      >
        {selectedProject && (
          <div className="flex h-full flex-col">
            <div className="border-b border-slate-200/80 bg-white/90 px-6 pb-6 pt-10 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/90 sm:px-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
                  {selectedProject.category || dict.projects.defaultCategory}
                </span>
                {selectedProject.date && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.25em] text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
                    <Calendar className="h-3 w-3" aria-hidden />
                    {selectedProject.date}
                  </span>
                )}
              </div>
              <SheetHeader className="mt-4 p-0">
                <SheetTitle className="text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                  {selectedProject.live ? (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 transition-colors hover:text-myorange-100"
                    >
                      <span>{selectedProject.title}</span>
                      <ExternalLink className="h-5 w-5" aria-hidden />
                    </a>
                  ) : (
                    selectedProject.title
                  )}
                </SheetTitle>
                <SheetDescription className="max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
                  {selectedProject.description}
                </SheetDescription>
              </SheetHeader>
            </div>

            <div className="flex-1 space-y-6 px-6 py-6 sm:px-8">
              <div className="relative aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {selectedProject.image ? (
                  selectedProject.live ? (
                    <a
                      href={selectedProject.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${dict.projects.visitLiveSite}: ${selectedProject.title}`}
                      className="block h-full w-full"
                    >
                      <Image
                        src={selectedProject.image}
                        alt={selectedProject.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </a>
                  ) : (
                    <Image
                      src={selectedProject.image}
                      alt={selectedProject.title}
                      fill
                      className="object-cover"
                    />
                  )
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-5xl font-bold tracking-tight text-slate-200 dark:text-slate-800">
                      MK
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent p-6">
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.22em] text-white/90 backdrop-blur-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50/70 p-6 dark:border-slate-800 dark:bg-slate-900/60">
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                  {labels.aboutLabel}
                </p>
                <p className="mt-4 text-[15px] leading-8 text-slate-600 dark:text-slate-300">
                  {selectedProject.longDescription}
                </p>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <p className="text-[11px] font-mono uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">
                  {labels.taskTitle}
                </p>
                <ul className="mt-5 space-y-3">
                  {selectedProject.tasks.length > 0 ? (
                    selectedProject.tasks.map((task, index) => (
                      <li
                        key={task}
                        className="flex gap-4 rounded-2xl border items-center border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-relaxed text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                      >
                        <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-myorange-100 text-[11px] font-mono font-semibold text-white">
                          {index + 1}
                        </span>
                        <span className="font-medium">{task}</span>
                      </li>
                    ))
                  ) : (
                    <li className="rounded-2xl border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                      {selectedProject.description}
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
