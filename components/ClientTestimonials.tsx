'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp, Clock, Users } from 'lucide-react';

const testimonials = [
  {
    name: 'Marie Dubois',
    company: 'PCMGE - PME Chartres',
    role: 'Directrice',
    avatar: '/testimonials/marie-dubois.jpg',
    quote:
      "La refonte de notre site a transformé notre visibilité locale. Nous avons gagné 40% de nouveaux clients en 6 mois grâce à l'optimisation SEO.",
    metrics: [
      {
        icon: <TrendingUp className="w-4 h-4" />,
        label: '+40% nouveaux clients',
        value: '6 mois',
      },
      {
        icon: <Clock className="w-4 h-4" />,
        label: 'Temps de chargement',
        value: '2.1s → 0.8s',
      },
    ],
    project: 'Refonte site vitrine + CRM interne',
    rating: 5,
  },
  {
    name: 'Thomas Martin',
    company: 'AlertJO.fr',
    role: 'Fondateur',
    avatar: '/testimonials/thomas-martin.jpg',
    quote:
      "L'application de surveillance des JO est devenue indispensable à notre activité. Performance exceptionnelle et support réactif.",
    metrics: [
      {
        icon: <Users className="w-4 h-4" />,
        label: 'Utilisateurs actifs',
        value: '+200%',
      },
      {
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Temps de traitement',
        value: '5min → 30s',
      },
    ],
    project: 'Application web de surveillance JO',
    rating: 5,
  },
  {
    name: 'Sophie Leroy',
    company: 'Boutique Moderne',
    role: 'Gérante',
    avatar: '/testimonials/sophie-leroy.jpg',
    quote:
      "Notre boutique en ligne a doublé ses ventes grâce à l'optimisation du tunnel de conversion. Interface intuitive et paiements sécurisés.",
    metrics: [
      {
        icon: <TrendingUp className="w-4 h-4" />,
        label: 'Ventes en ligne',
        value: '+100%',
      },
      {
        icon: <Clock className="w-4 h-4" />,
        label: 'Taux de conversion',
        value: '2.1% → 4.3%',
      },
    ],
    project: 'E-commerce + optimisation conversion',
    rating: 5,
  },
];

const miniCaseStudies = [
  {
    title: 'Performance Web',
    description: 'Optimisation Core Web Vitals',
    metrics: [
      { label: 'LCP', before: '3.2s', after: '0.9s', improvement: '+72%' },
      { label: 'CLS', before: '0.25', after: '0.05', improvement: '+80%' },
      { label: 'FID', before: '180ms', after: '45ms', improvement: '+75%' },
    ],
  },
  {
    title: 'SEO Local',
    description: 'Référencement Chartres & Eure-et-Loir',
    metrics: [
      {
        label: 'Impressions',
        before: '1.2k',
        after: '3.8k',
        improvement: '+217%',
      },
      { label: 'Clics', before: '45', after: '156', improvement: '+247%' },
      {
        label: 'Position moyenne',
        before: '12.3',
        after: '4.7',
        improvement: '+62%',
      },
    ],
  },
  {
    title: 'Conversion',
    description: 'Optimisation formulaires & CTA',
    metrics: [
      {
        label: 'Taux de remplissage',
        before: '8.2%',
        after: '22.1%',
        improvement: '+169%',
      },
      {
        label: 'Leads qualifiés',
        before: '12/mois',
        after: '34/mois',
        improvement: '+183%',
      },
      {
        label: 'Coût par lead',
        before: '€45',
        after: '€18',
        improvement: '-60%',
      },
    ],
  },
];

export default function ClientTestimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
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
            <Star className="w-4 h-4" />
            Témoignages Clients
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ce que disent mes <span className="text-myorange-100">clients</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez les résultats concrets obtenus par mes clients et les
            métriques qui témoignent de l'efficacité de mes solutions.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-gray-700 mb-6 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>

              {/* Metrics */}
              <div className="space-y-3 mb-6">
                {testimonial.metrics.map((metric, metricIndex) => (
                  <div key={metricIndex} className="flex items-center gap-3">
                    <div className="p-2 bg-myorange-100/10 rounded-lg">
                      {metric.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {metric.label}
                      </div>
                      <div className="text-lg font-bold text-myorange-100">
                        {metric.value}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <div className="w-12 h-12 bg-gradient-to-br from-myorange-100 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role}, {testimonial.company}
                  </div>
                  <div className="text-xs text-myorange-100 font-medium">
                    {testimonial.project}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini Case Studies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Métriques de Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {miniCaseStudies.map((study, index) => (
              <div key={index} className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {study.title}
                </h4>
                <p className="text-sm text-gray-600 mb-4">
                  {study.description}
                </p>
                <div className="space-y-3">
                  {study.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="text-sm font-medium text-gray-700 mb-1">
                        {metric.label}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-500">
                          {metric.before}
                        </span>
                        <span className="text-xs text-gray-400">→</span>
                        <span className="text-sm font-semibold text-myorange-100">
                          {metric.after}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-green-600">
                        {metric.improvement}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
