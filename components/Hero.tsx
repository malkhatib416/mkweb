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
    <section className="hero-wrapper" id="main">
      <div className="custom-screen pt-28 text-white h-screen flex items-center justify-center">
        <div className="space-y-8 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl text-white font-extrabold mx-auto sm:text-6xl">
              Transformez vos idées en{' '}
              <span className="text-myorange-100">applications web performantes</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="max-w-xl mx-auto text-lg">
              J'accompagne les startups et entreprises 
              dans la création de solutions web sur-mesure, performantes et évolutives.
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
              className="text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100 px-6 py-3 rounded-lg flex items-center gap-2 group"
            >
              <span>Discutons de votre projet</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NavLink>
          </motion.div>

         
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex items-center justify-center gap-4 text-sm text-white/80"
          >
            <span>✓ Réponse sous 24h</span>
            <span>•</span>
            <span>✓ +5 ans d'expérience</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
