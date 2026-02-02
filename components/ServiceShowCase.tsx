'use client';

import { Card } from '@/components/ui/card';
import type { Dictionary } from '@/locales/dictionaries';
import { motion } from 'framer-motion';
import {
  Code,
  Cog,
  Lightbulb,
  RefreshCw,
  ShoppingCart,
  Smartphone,
} from 'lucide-react';

type Props = {
  dict: Dictionary;
};

export default function ServiceShowCase({ dict }: Props) {
  const services = [
    {
      icon: <Code className="w-10 h-10 text-myorange-100" />,
      title: dict.services.website.title,
      description: dict.services.website.description,
      features: [
        dict.services.website.feature1,
        dict.services.website.feature2,
        dict.services.website.feature3,
      ],
    },
    {
      icon: <Smartphone className="w-10 h-10 text-myorange-100" />,
      title: dict.services.mobileapp.title,
      description: dict.services.mobileapp.description,
      features: [
        dict.services.mobileapp.feature1,
        dict.services.mobileapp.feature2,
        dict.services.mobileapp.feature3,
      ],
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-myorange-100" />,
      title: dict.services.ecommerce.title,
      description: dict.services.ecommerce.description,
      features: [
        dict.services.ecommerce.feature1,
        dict.services.ecommerce.feature2,
        dict.services.ecommerce.feature3,
      ],
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-myorange-100" />,
      title: dict.services.redesign.title,
      description: dict.services.redesign.description,
      features: [
        dict.services.redesign.feature1,
        dict.services.redesign.feature2,
        dict.services.redesign.feature3,
      ],
    },
    {
      icon: <Cog className="w-10 h-10 text-myorange-100" />,
      title: dict.services.maintenance.title,
      description: dict.services.maintenance.description,
      features: [
        dict.services.maintenance.feature1,
        dict.services.maintenance.feature2,
        dict.services.maintenance.feature3,
      ],
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-myorange-100" />,
      title: dict.services.innovation.title,
      description: dict.services.innovation.description,
      features: [
        dict.services.innovation.feature1,
        dict.services.innovation.feature2,
        dict.services.innovation.feature3,
      ],
    },
  ];

  return (
    <section
      className="py-32 bg-white dark:bg-slate-950 relative overflow-hidden"
      id="services"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-mono uppercase tracking-widest mb-8 shadow-sm">
            <Cog className="w-3.5 h-3.5 text-myorange-100" />
            {dict.services.badge}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-slate-900 dark:text-white tracking-tight">
            {dict.services.title}
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            {dict.services.subtitle}
          </p>
        </motion.div>

        {/* Uniform grid: all cards same size */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group"
            >
              <Card className="h-full p-8 md:p-10 flex flex-col items-start bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 border border-slate-200/60 dark:border-slate-800/60 rounded-[2rem] hover:shadow-[0_0_50px_-12px_rgba(0,0,0,0.08)] dark:hover:shadow-none hover:border-myorange-100/20 dark:hover:border-myorange-100/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-myorange-100/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 w-full flex flex-col h-full">
                  <div className="mb-6 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl w-fit shadow-sm group-hover:scale-110 transition-transform duration-500">
                    {service.icon}
                  </div>

                  <h3 className="font-bold text-xl text-slate-900 dark:text-white group-hover:text-myorange-100 transition-colors tracking-tight mb-4">
                    {service.title}
                  </h3>

                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium mb-6 flex-1">
                    {service.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-600/50 w-full">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {service.features.map((feature, featureIndex) => (
                        <li
                          key={featureIndex}
                          className="flex items-center gap-2.5 text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"
                        >
                          <div className="w-1 h-1 bg-myorange-100 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
