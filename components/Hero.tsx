'use client';

import { motion } from 'framer-motion';
import { ArrowRight, FileText, Zap, Code, Globe } from 'lucide-react';
import NavLink from './NavLink';
import type { Dictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';

type Props = {
  dict: Dictionary;
  locale: Locale;
};

export default function Hero({ dict, locale }: Props) {
  return (
    <section
      className="relative overflow-hidden bg-white dark:bg-slate-950 dot-grid min-h-screen flex items-center justify-center pt-24"
      id="main"
    >
      {/* Background radial gradient for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_70%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,theme(colors.slate.950)_70%)] pointer-events-none" />

      <div className="custom-screen relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-wider mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-myorange-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-myorange-100"></span>
              </span>
              {dict.hero.badge}
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-[5.5rem] font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
              {dict.hero.title}{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-myorange-100 to-myorange-200">
                {dict.hero.titleHighlight}
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium mb-12">
              {dict.hero.subtitle}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <NavLink
              href="https://calendly.com/mk-web28/30min"
              target="_blank"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-xl flex items-center justify-center gap-2 group text-sm font-bold transition-all duration-200 border border-slate-800 dark:border-white shadow-lg shadow-slate-200 dark:shadow-none"
            >
              <span>{dict.hero.cta}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </NavLink>

            <NavLink
              href={`/${locale}/estimation`}
              className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-950 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2 group text-sm font-bold transition-all duration-200"
            >
              <FileText className="w-4 h-4" />
              <span>{dict.hero.estimationCta}</span>
            </NavLink>
          </motion.div>

          {/* Atomic Features Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-12 border-t border-slate-100 dark:border-slate-800"
          >
            {[
              { icon: <Zap className="w-4 h-4" />, text: dict.hero.feature1 },
              { icon: <Code className="w-4 h-4" />, text: dict.hero.feature2 },
              { icon: <Globe className="w-4 h-4" />, text: dict.hero.feature3 },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors cursor-default"
              >
                <div className="text-myorange-100">{feature.icon}</div>
                <span className="text-[11px] font-mono uppercase tracking-widest leading-none">
                  {feature.text}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
