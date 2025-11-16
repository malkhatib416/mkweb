'use client';

import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
import NavLink from './NavLink';
import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';

type Props = {
  dict: Dictionary;
  locale: Locale;
};

export default function Hero({ dict, locale }: Props) {
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
              {dict.hero.badge}
            </div>
            <h1 className="text-4xl text-white font-extrabold mx-auto sm:text-6xl lg:text-7xl leading-tight">
              {dict.hero.title}{' '}
              <span className="text-myorange-100 bg-gradient-to-r from-myorange-100 to-red-500 bg-clip-text text-transparent">
                {dict.hero.titleHighlight}
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="max-w-2xl mx-auto text-xl leading-relaxed text-white/90">
              {dict.hero.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 font-medium text-sm"
          >
            <NavLink
              href="https://calendly.com/mk-web28/30min"
              target="_blank"
              className="text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100 px-8 py-4 rounded-xl flex items-center gap-2 group text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <span>{dict.hero.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NavLink>

            <NavLink
              href={`/${locale}/estimation`}
              className="text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 border border-white/30 px-8 py-4 rounded-xl flex items-center gap-2 group text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>{dict.hero.estimationCta}</span>
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
              <span className="text-sm font-medium">{dict.hero.feature1}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-sm font-medium">{dict.hero.feature2}</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium">{dict.hero.feature3}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
