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
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export default function ServiceShowCase() {
  const services = [
    {
      icon: <Code className="w-12 h-12 text-myorange-100" />,
      title: 'Création de site internet',
      description:
        'Sites vitrines et corporate sur-mesure, conçus pour convertir vos visiteurs en clients.',
      features: ['Design responsive premium', 'SEO optimisé dès le départ', 'Performance maximale', 'Interface intuitive'],
      price: 'À partir de 1 500€',
      popular: false
    },
    {
      icon: <ShoppingCart className="w-12 h-12 text-myorange-100" />,
      title: 'E-commerce',
      description:
        'Boutiques en ligne performantes qui transforment les visiteurs en acheteurs fidèles.',
      features: ['Paiements sécurisés', 'Gestion stocks avancée', 'Analytics détaillés', 'Mobile-first'],
      price: 'À partir de 3 500€',
      popular: true
    },
    {
      icon: <RefreshCw className="w-12 h-12 text-myorange-100" />,
      title: 'Refonte de site',
      description:
        "Modernisation complète pour multiplier l'impact de votre présence digitale.",
      features: ['Audit complet inclus', 'Migration sécurisée', 'Formation équipe', 'Amélioration UX/UI'],
      price: 'À partir de 2 000€',
      popular: false
    },
    {
      icon: <Cog className="w-12 h-12 text-myorange-100" />,
      title: 'Maintenance & Support',
      description:
        'Surveillance proactive et support réactif pour un site toujours au top.',
      features: ['Monitoring 24/7', 'Sauvegardes automatiques', 'Mises à jour sécurité', 'Support prioritaire'],
      price: 'À partir de 150€/mois',
      popular: false
    },
    {
      icon: <Cloud className="w-12 h-12 text-myorange-100" />,
      title: 'Hébergement Premium',
      description:
        "Solutions d'hébergement haute performance pour une disponibilité maximale.",
      features: ['SSL premium inclus', 'CDN mondial', 'Monitoring continu', 'Backup quotidien'],
      price: 'À partir de 50€/mois',
      popular: false
    },
    {
      icon: <Lightbulb className="w-12 h-12 text-myorange-100" />,
      title: 'Solutions Innovantes',
      description:
        'Intégration des dernières technologies pour vous démarquer de la concurrence.',
      features: ['IA intégrée', 'API modernes', 'Technologies émergentes', 'Conseil stratégique'],
      price: 'Sur devis',
      popular: false
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 via-white to-blue-50/30" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-myorange-100/10 text-myorange-100 px-6 py-3 rounded-full text-sm font-semibold mb-6 border border-myorange-100/20">
            <Cog className="w-4 h-4" />
            Services Premium
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900 leading-tight">
            Des solutions web qui
            <span className="block text-myorange-100 bg-gradient-to-r from-myorange-100 to-red-500 bg-clip-text text-transparent">
              transforment votre business
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            De la conception à la maintenance, je vous accompagne avec des solutions 
            sur-mesure qui allient performance technique et excellence visuelle.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative"
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-gradient-to-r from-myorange-100 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    ⭐ Plus populaire
                  </span>
                </div>
              )}
              
              <Card className={`p-8 flex flex-col bg-white shadow-xl hover:shadow-2xl transition-all duration-500 h-full rounded-3xl group-hover:scale-105 border-2 ${
                service.popular 
                  ? 'border-myorange-100/30 ring-2 ring-myorange-100/20' 
                  : 'border-gray-100 hover:border-myorange-100/30'
              }`}>
                <div className="mb-8 p-4 bg-gradient-to-br from-myorange-100/10 to-red-500/10 rounded-2xl group-hover:from-myorange-100/20 group-hover:to-red-500/20 transition-all duration-300 w-fit">
                  {service.icon}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-myorange-100 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-lg">
                  {service.description}
                </p>
                
                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-gray-700">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-2xl font-bold text-gray-900 mb-2">{service.price}</div>
                  <div className="text-sm text-gray-500">Devis personnalisé gratuit</div>
                </div>

                {/* CTA Button */}
                <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 group/btn ${
                  service.popular
                    ? 'bg-gradient-to-r from-myorange-100 to-red-500 text-white hover:shadow-lg hover:shadow-myorange-100/25'
                    : 'bg-gray-100 text-gray-900 hover:bg-myorange-100 hover:text-white'
                }`}>
                  <span>Demander un devis</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-20"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-12 md:p-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Besoin d'une solution sur-mesure ?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Chaque projet est unique. Discutons de vos besoins spécifiques 
              pour créer la solution parfaite pour votre entreprise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/nous-contacter"
                className="inline-flex items-center gap-2 bg-myorange-100 text-white px-8 py-4 rounded-xl font-semibold hover:bg-myorange-100/90 transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Consultation gratuite
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="tel:+33646777804"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all duration-200"
              >
                Appeler maintenant
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}