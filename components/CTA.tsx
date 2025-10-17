'use client';

import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Clock, Shield } from 'lucide-react';
import NavLink from './NavLink';

const benefits = [
  {
    icon: MessageCircle,
    text: 'Réponse < 24h',
  },
  {
    icon: Clock,
    text: 'Kickoff en 7 jours',
  },
  {
    icon: Shield,
    text: 'Maintenance 24/7',
  },
];

const CTA = () => (
  <SectionWrapper className="bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0">
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-myorange-100/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
    </div>

    <div className="custom-screen relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          Prêt à démarrer
        </div>

        <h2 className="text-white text-4xl md:text-5xl font-bold mb-6" id="oss">
          Prêt à{' '}
          <span className="bg-gradient-to-r from-myorange-100 to-red-500 bg-clip-text text-transparent">
            booster votre business ?
          </span>
        </h2>

        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
          Génération de leads, rapidité, sécurité, maintenance proactive.
          Discutons de votre projet pour des résultats mesurables dès le premier
          mois.
        </p>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-8 mb-10"
        >
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2 text-white/90">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <benefit.icon className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium">{benefit.text}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <NavLink
            href="/nous-contacter"
            className="text-gray-900 bg-white hover:bg-gray-100 active:bg-gray-200 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center gap-2 group"
          >
            Discutons de votre projet
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </NavLink>

          <a
            href="mailto:contact@mk-web.fr"
            className="text-white border border-white/30 hover:border-white/50 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold text-lg backdrop-blur-sm transition-all duration-200"
          >
            Envoyer un email
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-white/70 text-sm mt-6"
        >
          <span className="text-myorange-100 font-semibold">
            Réponse garantie sous 24h
          </span>{' '}
          • Devis gratuit et sans engagement
        </motion.p>
      </motion.div>
    </div>
  </SectionWrapper>
);

const SectionWrapper = ({ children, className = '', ...props }: any) => (
  <section {...props} className={`py-24 ${className}`}>
    {children}
  </section>
);

export default CTA;
