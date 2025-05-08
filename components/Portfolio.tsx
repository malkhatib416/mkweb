'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';

const projects = [
    {
        title: 'MK-Web Portfolio',
        description: 'A modern, responsive portfolio website built with Next.js 14, TypeScript, and Tailwind CSS. Features dark mode, animations, and SEO optimization.',
        technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
        image: '/projects/portfolio.jpg',
        github: 'https://github.com/yourusername/mkweb',
        live: 'https://www.mk-web.fr',
    },
    {
        title: 'Project Showcase',
        description: 'A dynamic project management platform with real-time updates and collaborative features.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
        image: '/projects/showcase.jpg',
        github: 'https://github.com/yourusername/project-showcase',
        live: 'https://showcase.mk-web.fr',
    },
    // Add more projects as needed
];

export default function Portfolio() {
    return (
        <section className="py-20 bg-gradient-to-b from-background to-muted/50">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Portfolio de Projets</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Découvrez mes réalisations et projets personnels qui démontrent mon expertise en développement web.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="relative h-48 bg-muted">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                                <p className="text-muted-foreground mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech, techIndex) => (
                                        <span
                                            key={techIndex}
                                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-4">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <Github className="w-5 h-5" />
                                        <span>Code</span>
                                    </a>
                                    <a
                                        href={project.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                        <span>Demo</span>
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
