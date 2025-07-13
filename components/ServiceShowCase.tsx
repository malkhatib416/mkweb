'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Cloud,
  Code,
  Cog,
  Lightbulb,
  RefreshCw,
  ShoppingCart,
} from 'lucide-react';

export default function ServiceShowCase() {
  const services = [
    {
      icon: <Code className="w-10 h-10 text-myorange-100" />,
      title: 'Création de site internet',
      description:
        'Conception de sites vitrines et corporate sur-mesure, pensés pour valoriser votre image et atteindre vos objectifs.',
      features: ['Design responsive', 'SEO optimisé', 'Performance maximale']
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-myorange-100" />,
      title: 'E-commerce',
      description:
        'Développement de boutiques en ligne performantes, évolutives et optimisées pour la conversion.',
      features: ['Paiements sécurisés', 'Gestion stocks', 'Analytics avancés']
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-myorange-100" />,
      title: 'Refonte de site',
      description:
        "Modernisation de votre site pour booster son impact, sa performance et l'expérience utilisateur.",
      features: ['Audit complet', 'Migration sécurisée', 'Formation incluse']
    },
    {
      icon: <Cog className="w-10 h-10 text-myorange-100" />,
      title: 'Maintenance',
      description:
        'Surveillance proactive, mises à jour régulières et support réactif pour un site toujours opérationnel.',
      features: ['Support 24/7', 'Sauvegardes auto', 'Mises à jour sécurité']
    },
    {
      icon: <Cloud className="w-10 h-10 text-myorange-100" />,
      title: 'Hébergement',
      description:
        "Solutions d'hébergement sécurisées et adaptées à vos besoins pour garantir la disponibilité de votre site.",
      features: ['SSL inclus', 'CDN mondial', 'Monitoring continu']
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-myorange-100" />,
      title: 'Innovation',
      description:
        'Intégration des dernières technologies web pour des solutions innovantes et différenciantes.',
      features: ['IA intégrée', 'API modernes', 'Technologies émergentes']
    },
  ];

  return (
    <section className="py-24 bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-myorange-100/10 text-myorange-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cog className="w-4 h-4" />
            Services
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Mes Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Je vous accompagne à chaque étape de votre projet digital : création
            de site, e-commerce, refonte, maintenance, hébergement et
            innovation.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="p-8 flex flex-col items-start bg-white shadow-lg hover:shadow-2xl transition-all duration-300 h-full border-0 rounded-2xl group-hover:scale-105">
                <div className="mb-6 p-3 bg-myorange-100/10 rounded-xl group-hover:bg-myorange-100/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-myorange-100 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>
                
                {/* Features list */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-myorange-100 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
