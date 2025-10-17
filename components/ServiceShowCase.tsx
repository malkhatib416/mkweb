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
        'Sites vitrines et corporate sur-mesure pour générer des leads qualifiés et valoriser votre expertise locale.',
      features: [
        'Core Web Vitals : LCP < 1.2s, CLS < 0.1 sur mobile',
        'SEO local : +20% impressions, Next.js 15 + Edge SSR',
        'Conversion optimisée : formulaires +35% de taux de remplissage',
      ],
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-myorange-100" />,
      title: 'E-commerce',
      description:
        'Boutiques en ligne sécurisées avec tunnel de conversion optimisé pour maximiser vos ventes.',
      features: [
        'Paiements 3D Secure + Stripe : 0% de fraude',
        'Temps de chargement < 2s : +40% de conversions',
        'Analytics e-commerce : suivi ROI en temps réel',
      ],
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-myorange-100" />,
      title: 'Refonte de site',
      description:
        'Migration sécurisée vers des technologies modernes pour améliorer performance et conversions.',
      features: [
        'Audit technique : rapport détaillé + roadmap',
        'Migration 0 downtime : sauvegardes automatiques',
        'Formation équipe : 2h de formation incluse',
      ],
    },
    {
      icon: <Cog className="w-10 h-10 text-myorange-100" />,
      title: 'Maintenance',
      description:
        'Surveillance proactive 24/7 avec SLA garantis pour maintenir votre site opérationnel et sécurisé.',
      features: [
        'SLA : Réponse < 2h, résolution < 24h',
        'Sauvegardes quotidiennes : 30 jours de rétention',
        'Mises à jour sécurité : patchs critiques < 4h',
      ],
    },
    {
      icon: <Cloud className="w-10 h-10 text-myorange-100" />,
      title: 'Hébergement',
      description:
        "Infrastructure cloud haute disponibilité avec monitoring 24/7 pour garantir 99.9% d'uptime.",
      features: [
        "SSL Let's Encrypt : renouvellement automatique",
        'CDN Cloudflare : 200+ points de présence',
        'Monitoring : alertes temps réel + métriques détaillées',
      ],
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-myorange-100" />,
      title: 'Innovation',
      description:
        "Intégration d'IA et technologies émergentes pour automatiser vos processus et différencier votre offre.",
      features: [
        'IA conversationnelle : chatbots + assistants virtuels',
        'API REST/GraphQL : intégrations tierces sécurisées',
        'PWA : applications web natives cross-platform',
      ],
    },
  ];

  return (
    <section className=" bg-white" id="services">
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
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
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
