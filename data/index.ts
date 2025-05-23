import { BlogPost, Category } from "@/types";

export const categories: Category[] = [
  { id: "seo", name: "SEO", color: "background: #FF7F50; color: #fff;" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "3206b200-4aee-44d8-8efd-d5a13debd195",
    title: "Bien débuter en SEO : les bases essentielles",
    description:
      "Comprendre les fondamentaux du référencement naturel pour améliorer la visibilité de votre site sur les moteurs de recherche.",
    content:
      "Le SEO (Search Engine Optimization) est une pratique incontournable pour toute présence en ligne durable. Pour bien débuter, il est essentiel de comprendre comment les moteurs de recherche indexent et classent les contenus.\n\nParmi les bases à maîtriser : le choix des bons mots-clés, l’optimisation des balises HTML (title, meta description, H1, etc.), la qualité du contenu, la vitesse de chargement du site, et l’ergonomie mobile. Il faut également penser à structurer correctement les URLs et à utiliser un plan de site (sitemap.xml).\n\nEnfin, l’analyse des performances via des outils comme Google Search Console et Google Analytics permet de suivre l’impact des optimisations mises en place.",
    categories: ["seo"],
    author: "Mohamad Al-Khatib",
    publishedAt: "2025-05-19",
    readTime: 4,
  },
  {
    id: "ccbd1746-bf2e-44ab-b1fc-d8fcf0d2c98b",
    title: "SEO : les erreurs fréquentes à éviter dès le départ",
    description:
      "Découvrez les pièges les plus courants en SEO et comment les éviter pour maximiser vos chances de réussite.",
    content:
      "Quand on commence en SEO, il est facile de commettre des erreurs qui peuvent nuire à la visibilité d’un site. Parmi les plus fréquentes : ignorer l’intention de recherche des utilisateurs, surcharger les pages de mots-clés (keyword stuffing), ou encore négliger l’optimisation mobile.\n\nUne autre erreur est de négliger le maillage interne, qui permet aux moteurs de recherche de mieux comprendre la structure du site. De même, l’absence de backlinks (liens entrants) ou leur mauvaise qualité peut freiner le positionnement.\n\nPour éviter ces pièges, il est recommandé de suivre les bonnes pratiques recommandées par Google et de rester à jour avec les évolutions de l’algorithme.",
    categories: ["seo"],
    author: "Mohamad Al-Khatib",
    publishedAt: "2025-05-23",
    readTime: 3,
  },
];
