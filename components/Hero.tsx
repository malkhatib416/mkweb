'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import NavLink from './NavLink';

// const technologies = [
//   { name: 'React', logo: '/tech/react.svg' },
//   { name: 'Next.js', logo: '/tech/nextjs.svg' },
//   { name: 'Node.js', logo: '/tech/nodejs.svg' },
//   { name: 'TypeScript', logo: '/tech/typescript.svg' },
// ];

export default function Hero() {
  return (
    <section className="hero-wrapper relative overflow-hidden" id="main">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-myorange-100/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="custom-screen pt-32 pb-20 text-white min-h-screen flex items-center justify-center relative z-10">
        <div className="space-y-8 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Disponible pour nouveaux projets
            </div>
            <h1 className="text-4xl text-white font-extrabold mx-auto sm:text-6xl lg:text-7xl leading-tight">
              Développeur web freelance à Chartres —{' '}
              <span className="text-myorange-100 bg-gradient-to-r from-myorange-100 to-red-500 bg-clip-text text-transparent">
                sites et SaaS ultra‑performants
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90">
              Je conçois, optimise et maintiens vos applications pour des
              résultats mesurables : vitesse, SEO, conversions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center justify-center gap-x-4 font-medium text-sm"
          >
            <NavLink
              href="/nous-contacter"
              className="text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100 px-8 py-4 rounded-xl flex items-center gap-2 group text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <span>Discutons de votre projet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Réponse sous 24h</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">+5 ans d'expérience</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium">Support continu</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
