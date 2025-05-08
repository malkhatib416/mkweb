'use client';

import { motion } from 'framer-motion';
import {
    Lightbulb,
    Code2,
    TestTube2,
    Rocket,
    Wrench,
    Shield
} from 'lucide-react';

const steps = [
    {
        icon: Lightbulb,
        title: 'Consultation Initiale',
        description: 'Analyse de vos besoins et objectifs pour définir la meilleure stratégie digitale.',
    },
    {
        icon: Code2,
        title: 'Développement',
        description: 'Création de votre solution web avec les technologies les plus adaptées à votre projet.',
    },
    {
        icon: TestTube2,
        title: 'Tests & Qualité',
        description: 'Tests approfondis pour garantir la performance et la fiabilité de votre application.',
    },
    {
        icon: Rocket,
        title: 'Déploiement',
        description: 'Mise en ligne sécurisée et optimisation pour les moteurs de recherche.',
    },
    {
        icon: Wrench,
        title: 'Maintenance',
        description: 'Support technique et mises à jour régulières pour assurer le bon fonctionnement.',
    },
    {
        icon: Shield,
        title: 'Sécurité',
        description: 'Protection continue contre les menaces et sauvegardes régulières.',
    },
];

export default function Process() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold mb-4">Ma Méthodologie</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Une approche structurée et professionnelle pour garantir la réussite de votre projet web.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    <step.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold">{step.title}</h3>
                            </div>
                            <p className="text-muted-foreground">{step.description}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-16 text-center"
                >
                    <a
                        href="/nous-contacter"
                        className="inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors"
                    >
                        Démarrer Votre Projet
                    </a>
                </motion.div>
            </div>
        </section>
    );
};
