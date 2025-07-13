'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Award, Users, Clock, Target } from 'lucide-react';

const stats = [
  {
    icon: Award,
    number: '50+',
    label: 'Projets réalisés',
    color: 'text-blue-600'
  },
  {
    icon: Users,
    number: '30+',
    label: 'Clients satisfaits',
    color: 'text-green-600'
  },
  {
    icon: Clock,
    number: '5+',
    label: 'Années d\'expérience',
    color: 'text-purple-600'
  },
  {
    icon: Target,
    number: '100%',
    label: 'Projets livrés',
    color: 'text-myorange-100'
  }
];

const About = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-myorange-100/20 to-blue-500/20 rounded-3xl transform rotate-6"></div>
              <div className="relative bg-white p-8 rounded-3xl shadow-xl">
                <Image
                  src="/geek.svg"
                  alt="Votre expert web à Chartres"
                  width={400}
                  height={400}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <div className="inline-flex items-center gap-2 bg-myorange-100/10 text-myorange-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-myorange-100 rounded-full"></div>
              À propos de moi
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Votre partenaire digital à 
              <span className="text-myorange-100"> Chartres</span>
            </h2>
            
            <p className="mb-6 text-lg font-semibold text-gray-700 leading-relaxed">
              J'aide les entreprises à transformer leurs idées en solutions web
              performantes et sur-mesure.
            </p>
            
            <div className="space-y-4 mb-8">
              <p className="text-gray-600 leading-relaxed">
                Basé à <strong className="font-bold text-gray-900">Chartres</strong>,
                j'interviens sur la{' '}
                <strong className="font-bold text-gray-900">création</strong>, l'
                <strong className="font-bold text-gray-900">optimisation</strong> et la{' '}
                <strong className="font-bold text-gray-900">maintenance</strong> de sites web et
                d'applications, avec une approche centrée sur l'utilisateur et la
                performance.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                Mon objectif : vous offrir des{' '}
                <strong className="font-bold text-gray-900">solutions digitales uniques</strong>
                , parfaitement adaptées à vos besoins et à vos ambitions, pour
                booster votre présence en ligne et faciliter la gestion de vos
                projets.
              </p>
              
              <p className="text-gray-600 leading-relaxed">
                De l'intégration de{' '}
                <strong className="font-bold text-gray-900">fonctionnalités innovantes</strong>{' '}
                à la{' '}
                <strong className="font-bold text-gray-900">
                  conception d'expériences utilisateurs fluides
                </strong>
                , je mets mon expertise et ma rigueur au service de votre
                réussite.
              </p>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-50`}>
                      <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;