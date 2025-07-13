'use client';

import { motion } from 'framer-motion';
import { Award, Users, Clock, Target, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const achievements = [
  {
    icon: Users,
    number: '50+',
    label: 'Clients satisfaits',
    description: 'Startups et PME accompagnées'
  },
  {
    icon: Award,
    number: '5+',
    label: 'Années d\'expérience',
    description: 'En développement web'
  },
  {
    icon: Clock,
    number: '24h',
    label: 'Temps de réponse',
    description: 'Garantie de réactivité'
  },
  {
    icon: Target,
    number: '100%',
    label: 'Projets livrés',
    description: 'Dans les délais convenus'
  }
];

const skills = [
  { name: 'Next.js & React', level: 95 },
  { name: 'TypeScript', level: 90 },
  { name: 'Node.js & APIs', level: 88 },
  { name: 'SEO & Performance', level: 92 },
  { name: 'UI/UX Design', level: 85 },
  { name: 'E-commerce', level: 87 }
];

const About = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-myorange-100/20 to-blue-500/20 rounded-3xl transform rotate-3"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-2xl">
                <Image
                  src="/geek.svg"
                  alt="Mohamad Al-Khatib - Développeur web freelance à Chartres"
                  width={400}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-myorange-100 text-white p-4 rounded-2xl shadow-lg">
              <div className="text-2xl font-bold">5+</div>
              <div className="text-sm">Années</div>
            </div>
            
            <div className="absolute -bottom-6 -left-6 bg-blue-500 text-white p-4 rounded-2xl shadow-lg">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm">Projets</div>
            </div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center gap-2 bg-myorange-100/10 text-myorange-100 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                <Users className="w-4 h-4" />
                À propos de moi
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Votre partenaire digital
                <span className="block text-myorange-100">de confiance</span>
              </h2>
            </div>

            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                <strong className="text-gray-900">Développeur web passionné</strong> basé à Chartres, 
                je transforme vos idées en solutions digitales qui génèrent de vrais résultats pour votre business.
              </p>
              
              <p>
                Spécialisé dans les <strong className="text-gray-900">technologies modernes</strong> 
                (React, Next.js, TypeScript), je crée des expériences web exceptionnelles qui 
                captivent vos utilisateurs et boostent vos conversions.
              </p>
              
              <p>
                Mon approche ? <strong className="text-gray-900">Écoute, expertise technique et résultats mesurables.</strong> 
                Chaque projet est une opportunité de dépasser vos attentes et de faire grandir votre entreprise.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/nous-contacter"
                className="inline-flex items-center gap-2 bg-myorange-100 text-white px-8 py-4 rounded-xl font-semibold hover:bg-myorange-100/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Travaillons ensemble
                <ArrowRight className="w-5 h-5" />
              </a>
              
              <a
                href="/blog"
                className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
              >
                Lire mon blog
              </a>
            </div>
          </motion.div>
        </div>

        {/* Achievements grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-myorange-100/10 rounded-2xl mb-4">
                <achievement.icon className="w-8 h-8 text-myorange-100" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{achievement.number}</div>
              <div className="text-lg font-semibold text-gray-900 mb-1">{achievement.label}</div>
              <div className="text-sm text-gray-600">{achievement.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Skills section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Expertise Technique
            </h3>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Maîtrise des technologies les plus demandées pour créer des solutions performantes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className="space-y-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-semibold text-lg">{skill.name}</span>
                  <span className="text-myorange-100 font-bold">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className="h-3 bg-gradient-to-r from-myorange-100 to-red-500 rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: 1 + index * 0.1 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;