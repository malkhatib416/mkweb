'use client';

import { motion } from 'framer-motion';
import {
  Code2,
  Database,
  Globe,
  Layers,
  Shield,
  Zap,
} from 'lucide-react';

const expertise = [
  {
    category: 'Frontend',
    icon: Code2,
    skills: [
      { name: 'React', level: 90 },
      { name: 'Next.js', level: 85 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 90 },
    ],
  },
  {
    category: 'Backend',
    icon: Database,
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express', level: 80 },
      { name: 'MongoDB', level: 75 },
      { name: 'PostgreSQL', level: 70 },
    ],
  },
  {
    category: 'DevOps',
    icon: Layers,
    skills: [
      { name: 'Docker', level: 75 },
      { name: 'Git', level: 85 },
      { name: 'CI/CD', level: 70 },
      { name: 'AWS', level: 65 },
    ],
  },
  {
    category: 'Performance',
    icon: Zap,
    skills: [
      { name: 'SEO', level: 85 },
      { name: 'Web Vitals', level: 80 },
      { name: 'Caching', level: 75 },
      { name: 'CDN', level: 70 },
    ],
  },
  {
    category: 'Security',
    icon: Shield,
    skills: [
      { name: 'OWASP', level: 80 },
      { name: 'SSL/TLS', level: 85 },
      { name: 'Authentication', level: 85 },
      { name: 'Data Protection', level: 80 },
    ],
  },
  {
    category: 'Web Standards',
    icon: Globe,
    skills: [
      { name: 'HTML5', level: 90 },
      { name: 'CSS3', level: 90 },
      { name: 'JavaScript', level: 90 },
      { name: 'Accessibility', level: 85 },
    ],
  },
];

export default function Expertise() {
  return (
    <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Expertise Technique</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Un large éventail de compétences techniques pour répondre à tous vos besoins en développement web.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {expertise.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card p-6 rounded-lg shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <category.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{category.category}</h3>
              </div>
              <div className="space-y-4">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: skillIndex * 0.1 }}
                        className="h-2 bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

