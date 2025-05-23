import { BlogPost, Category } from "@/types";

export const categories: Category[] = [
  { id: "seo", name: "SEO", color: "background: #FF7F50; color: #fff;" },
];

export const blogPosts: BlogPost[] = [
  //   {
  //     id: "3206b200-4aee-44d8-8efd-d5a13debd195",
  //     title: "Bien débuter en SEO : les bases essentielles",
  //     description:
  //       "Comprendre les fondamentaux du référencement naturel pour améliorer la visibilité de votre site sur les moteurs de recherche.",
  //     content:
  //       "Le SEO (Search Engine Optimization) est une pratique incontournable pour toute présence en ligne durable. Pour bien débuter, il est essentiel de comprendre comment les moteurs de recherche indexent et classent les contenus.\n\nParmi les bases à maîtriser : le choix des bons mots-clés, l’optimisation des balises HTML (title, meta description, H1, etc.), la qualité du contenu, la vitesse de chargement du site, et l’ergonomie mobile. Il faut également penser à structurer correctement les URLs et à utiliser un plan de site (sitemap.xml).\n\nEnfin, l’analyse des performances via des outils comme Google Search Console et Google Analytics permet de suivre l’impact des optimisations mises en place.",
  //     categories: ["seo"],
  //     author: "Mohamad Al-Khatib",
  //     publishedAt: "2025-05-19",
  //     readTime: 4,
  //   },
  //   {
  //     id: "ccbd1746-bf2e-44ab-b1fc-d8fcf0d2c98b",
  //     title: "SEO : les erreurs fréquentes à éviter dès le départ",
  //     description:
  //       "Découvrez les pièges les plus courants en SEO et comment les éviter pour maximiser vos chances de réussite.",
  //     content:
  //       "Quand on commence en SEO, il est facile de commettre des erreurs qui peuvent nuire à la visibilité d’un site. Parmi les plus fréquentes : ignorer l’intention de recherche des utilisateurs, surcharger les pages de mots-clés (keyword stuffing), ou encore négliger l’optimisation mobile.\n\nUne autre erreur est de négliger le maillage interne, qui permet aux moteurs de recherche de mieux comprendre la structure du site. De même, l’absence de backlinks (liens entrants) ou leur mauvaise qualité peut freiner le positionnement.\n\nPour éviter ces pièges, il est recommandé de suivre les bonnes pratiques recommandées par Google et de rester à jour avec les évolutions de l’algorithme.",
  //     categories: ["seo"],
  //     author: "Mohamad Al-Khatib",
  //     publishedAt: "2025-05-23",
  //     readTime: 3,
  //   },
  {
    id: "guide-seo-debutant",
    title: "Guide simplifié : Comprendre le SEO et bien démarrer",
    description:
      "Un guide pratique pour comprendre les bases du SEO, optimiser votre site et attirer un trafic organique durable.",
    content: `<p>Vous avez terminé votre site web, peaufiné le design et rédigé votre contenu… il est enfin temps de publier.<br>Mais ensuite ?<br>Bienvenue dans le monde du <strong>SEO</strong> — Search Engine Optimization ou référencement naturel.</p>
<p>Ce guide simplifié vous permettra de comprendre les bases du SEO et vous donnera les clés pour positionner votre site efficacement dans les résultats de recherche.</p>
<h3>🎯 Points clés</h3>
<ul><li>Le SEO vise à améliorer la visibilité de votre site et à attirer du trafic organique (non payant).</li><li>Il comprend : la recherche de mots-clés, le SEO on-page, off-page et technique.</li><li>C’est un travail de long terme, qui nécessite de suivre vos performances, rester à jour et optimiser régulièrement votre contenu.</li></ul>
<h3>🔍 Qu’est-ce que le SEO ?</h3>
<p>C’est un ensemble de techniques permettant à votre site d’apparaître plus haut dans les résultats des moteurs de recherche comme Google. L’objectif : capter un maximum de trafic qualifié, gratuitement.</p>
<p>Les moteurs évaluent trois grands critères :</p>
<ul><li>La pertinence du contenu</li><li>La crédibilité du site</li><li>L’expérience utilisateur (vitesse, accessibilité mobile…)</li></ul>
<h3>📈 Pourquoi le SEO est-il important ?</h3>
<ul><li>Générer un trafic gratuit et durable</li><li>Devenir une autorité dans votre domaine</li><li>Offrir une expérience utilisateur optimale</li><li>Devancer vos concurrents</li></ul>
<h3>🔑 Recherche de mots-clés : la base du SEO</h3>
<p>Les mots-clés sont les expressions que vos utilisateurs tapent sur Google. Utilisez des outils comme Originality.ai, Ahrefs ou SEMrush pour :</p>
<ul><li>Identifier les mots-clés pertinents</li><li>Analyser l’intention de recherche (informationnelle, transactionnelle, etc.)</li><li>Cibler des mots-clés de longue traîne plus précis et moins concurrentiels</li></ul>
<h3>🧱 SEO On-Page : Optimiser votre contenu</h3>
<ul><li><strong>Titres & Méta-descriptions</strong> : incluez les mots-clés principaux dès le début</li><li><strong>Structure d’URL</strong> : claire, courte, avec des tirets</li><li><strong>Balises H1, H2, H3</strong> : pour organiser le contenu</li><li><strong>Liens internes</strong> : pour améliorer la navigation</li><li><strong>Optimisation des images</strong> : compression et balises ALT</li><li><strong>Responsive Design</strong> : indispensable pour le mobile</li></ul>
<h3>🔗 SEO Off-Page : Renforcer votre autorité</h3>
<p>Le SEO off-page repose sur les backlinks — liens provenant d’autres sites crédibles :</p>
<ul><li>Rédigez des articles invités</li><li>Collaborez avec des influenceurs ou journalistes</li><li>Créez du contenu unique à forte valeur ajoutée</li></ul>
<p><em>Attention aux techniques de liens douteuses qui enfreignent les règles de Google.</em></p>
<h3>⚙️ SEO Technique : Optimisez les performances</h3>
<ul><li>Vitesse de chargement : Google privilégie les sites rapides</li><li>Sitemap XML : pour faciliter l’indexation</li><li>Google Search Console : pour détecter les erreurs</li></ul>
<h3>📊 Suivi & Analyse</h3>
<p>Le SEO est un processus continu. Utilisez ces outils :</p>
<ul><li>Google Analytics : trafic, taux de rebond</li><li>Search Console : erreurs d’indexation</li><li>Originality.ai : scores d’optimisation</li><li>Ahrefs / SEMrush / Moz : suivi des mots-clés et backlinks</li></ul>
<p>Indicateurs importants à suivre :</p>
<ul><li>Trafic organique</li><li>Classement des mots-clés</li><li>Taux de clics (CTR)</li><li>Taux de rebond</li><li>Autorité de domaine (DA)</li></ul>
<h3>🚀 Prêt à vous lancer ?</h3>
<p>Le SEO est un investissement sur le long terme. Les résultats ne sont pas immédiats, mais les efforts réguliers paient.</p>
<p>Restez informé, optimisez votre contenu, et privilégiez la qualité à la quantité.<br>Continuez à apprendre sur le blog d’Originality.ai avec des articles comme :</p>
<ul><li>Marketing de contenu B2B vs B2C</li><li>Utiliser l’IA pour le clustering de sujets</li><li>Optimisation des pages d’atterrissage</li><li>Meilleurs outils SEO basés sur l’IA</li></ul>
<p><em>(une image sera ajoutée ici ultérieurement)</em></p>`,
    categories: ["seo"],
    author: "Mohamad Al-Khatib",
    publishedAt: "2025-05-23",
    readTime: 7,
  },
];
