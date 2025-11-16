'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Code,
  Cog,
  Lightbulb,
  RefreshCw,
  ShoppingCart,
  Smartphone,
} from 'lucide-react';
import type { Dictionary } from '@/locales/dictionaries';

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
    <section className=" bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-myorange-100/10 text-myorange-100 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Cog className="w-4 h-4" />
            {dict.services.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            {dict.services.title}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            {dict.services.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <Card className="p-8 flex flex-col items-start bg-white shadow-lg hover:shadow-2xl transition-all duration-300 h-full border-0 rounded-2xl group-hover:scale-105">
                <div className="mb-6 p-3 bg-myorange-100/10 rounded-xl group-hover:bg-myorange-100/20 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-myorange-100 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {service.description}
                </p>

                {/* Features list */}
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <div className="w-1.5 h-1.5 bg-myorange-100 rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
