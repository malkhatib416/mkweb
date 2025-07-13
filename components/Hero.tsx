'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Award } from 'lucide-react';
import NavLink from './NavLink';

const stats = [
  { icon: Users, value: '50+', label: 'Projets réalisés' },
  { icon: Star, value: '5.0', label: 'Note moyenne' },
  { icon: Award, value: '5+', label: 'Années d\'expérience' },
];

export default function Hero() {
  return (
    <section className="hero-wrapper relative overflow-hidden" id="main">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-myorange-100/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>
      
      <div className="custom-screen pt-32 pb-20 text-white min-h-screen flex items-center justify-center relative z-10">
        <div className="space-y-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white px-6 py-3 rounded-full text-sm font-medium mb-8 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Disponible pour nouveaux projets
            </div>
            <h1 className="text-5xl text-white font-extrabold mx-auto sm:text-6xl lg:text-8xl leading-tight mb-6">
              Créateur d'
              <span className="relative">
                <span className="text-myorange-100 bg-gradient-to-r from-myorange-100 via-red-500 to-orange-600 bg-clip-text text-transparent">
                  expériences web
                </span>
                <motion.div
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-myorange-100 to-red-500 rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 1 }}
                />
              </span>
              {' '}exceptionnelles
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          >
            <p className="max-w-3xl mx-auto text-xl leading-relaxed text-white/95 mb-8">
              Développeur web passionné basé à <strong>Chartres</strong>, je transforme vos idées en 
              solutions digitales performantes qui captivent vos utilisateurs et boostent votre business.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 font-medium"
          >
            <NavLink
              href="/nous-contacter"
              className="text-white bg-myorange-100 hover:bg-myorange-100/90 active:bg-myorange-100 px-10 py-5 rounded-2xl flex items-center gap-3 group text-lg font-semibold shadow-2xl hover:shadow-myorange-100/25 transition-all duration-300 hover:scale-105 border border-myorange-100/20"
            >
              <span>Démarrer votre projet</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </NavLink>
            
            <a
              href="#services"
              className="text-white border-2 border-white/30 hover:border-white/50 hover:bg-white/10 px-10 py-5 rounded-2xl font-semibold text-lg backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              Découvrir mes services
            </a>
          </motion.div>

          {/* Enhanced stats section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto pt-12"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.9 + index * 0.1 }}
                className="flex flex-col items-center gap-3 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300"
              >
                <div className="p-3 bg-myorange-100/20 rounded-xl">
                  <stat.icon className="w-6 h-6 text-myorange-100" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/80 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-wrap items-center justify-center gap-8 pt-8 text-white/70"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium">Réponse garantie sous 24h</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">Devis gratuit et détaillé</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium">Support continu inclus</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}