'use client';

import { motion } from 'framer-motion';
import { Calendar, ExternalLink, Github } from 'lucide-react';
import Image from 'next/image';
import type { Dictionary } from '@/locales/dictionaries';

type Props = {
  dict: Dictionary;
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

export default function LatestProjects({ dict }: Props) {
  const projects = getProjects(dict);

  const getStatusText = (status: string) => {
    if (status === 'online') return dict.projects.status.online;
    if (status === 'development') return dict.projects.status.development;
    return dict.projects.status.completed;
  };

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-myorange-100/10 text-myorange-100 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Calendar className="w-4 h-4" />
            {dict.projects.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {dict.projects.title}
            <span className="text-myorange-100">
              {' '}
              {dict.projects.titleHighlight}
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {dict.projects.subtitle}
          </p>
        </motion.div>

        {/* Featured Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {projects
            .filter((project) => project.featured)
            .map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
              >
                {/* Project Image */}
                <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        project.status === 'online'
                          ? 'bg-green-100 text-green-700'
                          : project.status === 'development'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 z-20">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                      {project.category}
                    </span>
                  </div>
                  {/* Placeholder for project image */}
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-myorange-100/20 to-blue-500/20">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="text-6xl font-bold text-white/30">
                        {project.title.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Project Content */}
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 group-hover:text-myorange-100 transition-colors">
                      {project.title}
                    </h3>
                    {/*<span className="text-sm text-gray-500 font-medium">
                      {project.date}
                    </span>*/}
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.longDescription}
                  </p>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.slice(0, 4).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-myorange-100/10 hover:text-myorange-100 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-sm">
                        +{project.technologies.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-myorange-100 text-white rounded-xl font-medium hover:bg-myorange-100/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {dict.projects.viewProject}
                      </a>
                    )}
                    {project?.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                      >
                        <Github className="w-4 h-4" />
                        {dict.projects.sourceCode}
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {/* Other Projects */}

        {!!projects.filter((project) => !project.featured).length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              {dict.projects.otherProjects}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter((project) => !project.featured)
                .map((project) => (
                  <div
                    key={project.id}
                    className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-myorange-100 transition-colors">
                        {project.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {project.date}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.technologies
                        .slice(0, 3)
                        .map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                    </div>

                    <div className="flex gap-3">
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-myorange-100 hover:text-myorange-100/80 transition-colors text-sm font-medium"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {dict.projects.demo}
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition-colors text-sm font-medium"
                        >
                          <Github className="w-3 h-3" />
                          {dict.projects.code}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
