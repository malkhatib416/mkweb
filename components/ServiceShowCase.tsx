'use client';

import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Cloud,
  Code,
  Cog,
  Lightbulb,
  RefreshCw,
  ShoppingCart,
} from 'lucide-react';

export default function ServiceShowCase() {
  const services = [
    {
      icon: <Code className="w-10 h-10 text-myorange-100" />,
      title: 'Création de site internet',
      description:
        'Conception de sites vitrines et corporate sur-mesure, pensés pour valoriser votre image et atteindre vos objectifs.',
    },
    {
      icon: <ShoppingCart className="w-10 h-10 text-myorange-100" />,
      title: 'E-commerce',
      description:
        'Développement de boutiques en ligne performantes, évolutives et optimisées pour la conversion.',
    },
    {
      icon: <RefreshCw className="w-10 h-10 text-myorange-100" />,
      title: 'Refonte de site',
      description:
        "Modernisation de votre site pour booster son impact, sa performance et l'expérience utilisateur.",
    },
    {
      icon: <Cog className="w-10 h-10 text-myorange-100" />,
      title: 'Maintenance',
      description:
        'Surveillance proactive, mises à jour régulières et support réactif pour un site toujours opérationnel.',
    },
    {
      icon: <Cloud className="w-10 h-10 text-myorange-100" />,
      title: 'Hébergement',
      description:
        "Solutions d'hébergement sécurisées et adaptées à vos besoins pour garantir la disponibilité de votre site.",
    },
    {
      icon: <Lightbulb className="w-10 h-10 text-myorange-100" />,
      title: 'Innovation',
      description:
        'Intégration des dernières technologies web pour des solutions innovantes et différenciantes.',
    },
  ];

  return (
    <section
      className="pb-20 bg-gradient-to-b from-background to-muted/50"
      id="services"
    >
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-myorange-200">
            Mes Services
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Je vous accompagne à chaque étape de votre projet digital : création
            de site, e-commerce, refonte, maintenance, hébergement et
            innovation. Bénéficiez d'un accompagnement sur-mesure, de solutions
            fiables et d'une expertise reconnue pour booster votre présence en
            ligne.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-8 flex flex-col items-start bg-white shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
        {/* <div className="flex justify-center mt-12">
          <NavLink
            href="/nous-contacter"
            className="text-white bg-myorange-100 hover:bg-myorange-100/80 active:bg-myorange-100 "
          >
            Demander un devis
          </NavLink>
        </div> */}
      </div>
    </section>
  );
}
