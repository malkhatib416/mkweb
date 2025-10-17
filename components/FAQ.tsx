'use client';

import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    question: 'Quels sont vos délais de réponse et de livraison ?',
    answer:
      "Je m'engage à vous répondre sous 24h et à démarrer votre projet en 7 jours maximum. Pour un site vitrine, comptez 2-3 semaines de développement. Pour une application complexe, 4-8 semaines selon les fonctionnalités.",
  },
  {
    question: 'Proposez-vous de la maintenance après la livraison ?',
    answer:
      'Oui, je propose un service de maintenance 24/7 avec SLA garantis : réponse < 2h, résolution < 24h. Sauvegardes quotidiennes, mises à jour de sécurité, et monitoring continu inclus.',
  },
  {
    question: 'Quels sont vos tarifs pour un site internet ?',
    answer:
      'Un site vitrine professionnel démarre à 1500€. Pour un e-commerce, comptez 3000-8000€ selon les fonctionnalités. Je propose des devis personnalisés gratuits et sans engagement.',
  },
  {
    question: 'Travaillez-vous avec des entreprises de Chartres uniquement ?',
    answer:
      'Je suis basé à Chartres mais je travaille avec des clients partout en France. Je me déplace dans un rayon de 50km pour les réunions, et propose des visioconférences pour les projets plus éloignés.',
  },
  {
    question: 'Quelles technologies utilisez-vous ?',
    answer:
      "Next.js 15, TypeScript, React pour le frontend. PostgreSQL, Drizzle ORM pour la base de données. Vercel, Cloudflare pour l'hébergement. Je privilégie les technologies modernes et performantes.",
  },
  {
    question: 'Proposez-vous des formations pour utiliser le site ?',
    answer:
      "Oui, j'inclus 2h de formation gratuite à la livraison. Je fournis également une documentation complète et un support par email pour vous accompagner dans l'utilisation de votre site.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Questions <span className="text-myorange-100">Fréquentes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Retrouvez les réponses aux questions les plus courantes sur mes
            services, tarifs et processus de travail.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-myorange-100 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>

              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 pb-4"
                >
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
