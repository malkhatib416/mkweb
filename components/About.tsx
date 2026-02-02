'use client';

import type { Dictionary } from '@/locales/dictionaries';
import { motion } from 'framer-motion';
import { Code, MapPin, Target, Zap } from 'lucide-react';
import Image from 'next/image';

type Props = {
  dict: Dictionary;
};

const About = ({ dict }: Props) => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-slate-950 dark:to-slate-950">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:w-2/5"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-myorange-100/20 rounded-full blur-3xl" />
              <Image
                src="/geek.svg"
                alt={dict.about.imageAlt}
                width={400}
                height={400}
                className="rounded-full relative z-10 shadow-2xl"
                priority
              />
            </div>
          </motion.div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-3/5"
          >
            {/* Intro */}
            <div className="mb-12">
              <p className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight mb-8">
                {dict.about.intro}
              </p>

              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                  <MapPin className="w-3.5 h-3.5 text-myorange-100" />
                  <span className="text-[10px] font-mono uppercase tracking-widest leading-none">
                    {dict.about.location} {dict.about.chartres}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-mono uppercase tracking-widest leading-none">
                    {dict.about.remote}
                  </span>
                </div>
              </div>
            </div>

            {/* Remote Work Description */}
            <div className="mb-10 p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-inner">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                <span className="text-emerald-500 font-bold mr-2 text-lg">
                  🌍
                </span>{' '}
                {dict.about.remoteDescription}
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <Code className="w-6 h-6 text-myorange-100 mt-1" />,
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {dict.about.services}{' '}
                      <span className="font-black text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors uppercase tracking-tighter">
                        {dict.about.creation}
                      </span>
                      {', '}
                      <span className="font-black text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors uppercase tracking-tighter">
                        {dict.about.optimization}
                      </span>{' '}
                      {dict.about.to} la{' '}
                      <span className="font-black text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors uppercase tracking-tighter">
                        {dict.about.maintenance}
                      </span>{' '}
                      {dict.about.description}
                    </p>
                  ),
                },
                {
                  icon: <Target className="w-6 h-6 text-myorange-100 mt-1" />,
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {dict.about.goal}{' '}
                      <span className="font-black text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors uppercase tracking-tighter">
                        {dict.about.uniqueSolutions}
                      </span>
                      {dict.about.adapted}
                    </p>
                  ),
                },
                {
                  icon: <Zap className="w-6 h-6 text-myorange-100 mt-1" />,
                  content: (
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {dict.about.expertise}{' '}
                      <span className="font-black text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors uppercase tracking-tighter">
                        {dict.about.innovative}
                      </span>{' '}
                      {dict.about.to}{' '}
                      <span className="font-black text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors uppercase tracking-tighter">
                        {dict.about.fluidUX}
                      </span>
                      {dict.about.commitment}
                    </p>
                  ),
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-sm hover:shadow-xl dark:hover:shadow-none transition-all duration-500 border border-slate-100 dark:border-slate-800 group"
                >
                  <div className="flex items-start gap-6">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl transition-colors group-hover:bg-myorange-100/10">
                      {item.icon}
                    </div>
                    <div>{item.content}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
