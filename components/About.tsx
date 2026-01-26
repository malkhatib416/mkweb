'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Code, Zap, Target, Globe } from 'lucide-react';
import type { Dictionary } from '@/locales/dictionaries';

type Props = {
  dict: Dictionary;
};

const About = ({ dict }: Props) => {
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
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
              <div className="absolute inset-0 bg-myorange-100/20 rounded-full blur-3xl"></div>
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
            <div className="mb-8">
              <p className="text-2xl md:text-3xl font-bold text-gray-900 leading-relaxed">
                {dict.about.intro}
              </p>
            </div>

            {/* Location & Remote Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 bg-myorange-100/10 text-myorange-100 px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">
                  {dict.about.location} {dict.about.chartres}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full border border-green-200">
                <Globe className="w-4 h-4" />
                <span className="font-medium">{dict.about.remote}</span>
              </div>
            </div>

            {/* Remote Work Description */}
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-100">
              <p className="text-gray-700 text-sm font-medium">
                <span className="text-green-600">🌍</span>{' '}
                {dict.about.remoteDescription}
              </p>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
              <div className="flex items-start gap-3 mb-4">
                <Code className="w-6 h-6 text-myorange-100 mt-1 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  {dict.about.services}{' '}
                  <span className="font-bold text-myorange-100">
                    {dict.about.creation}
                  </span>
                  , l'
                  <span className="font-bold text-myorange-100">
                    {dict.about.optimization}
                  </span>{' '}
                  {dict.about.to} la{' '}
                  <span className="font-bold text-myorange-100">
                    {dict.about.maintenance}
                  </span>{' '}
                  {dict.about.description}
                </p>
              </div>
            </div>

            {/* Goal */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6 border border-gray-100">
              <div className="flex items-start gap-3">
                <Target className="w-6 h-6 text-myorange-100 mt-1 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  {dict.about.goal}{' '}
                  <span className="font-bold text-myorange-100">
                    {dict.about.uniqueSolutions}
                  </span>
                  {dict.about.adapted}
                </p>
              </div>
            </div>

            {/* Expertise */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-myorange-100 mt-1 flex-shrink-0" />
                <p className="text-gray-700 leading-relaxed">
                  {dict.about.expertise}{' '}
                  <span className="font-bold text-myorange-100">
                    {dict.about.innovative}
                  </span>{' '}
                  {dict.about.to}{' '}
                  <span className="font-bold text-myorange-100">
                    {dict.about.fluidUX}
                  </span>
                  {dict.about.commitment}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
