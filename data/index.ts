import { BlogPost, Category } from "@/types";

export const categories: Category[] = [
  { id: "seo", name: "SEO", color: "background: #34a853; color: #fff;" },
  {
    id: "refonte",
    name: "Refonte",
    color: "background: #e67e22; color: #fff;",
  },
  { id: "tech", name: "Tech", color: "background: #6c63ff; color: #fff;" },
  { id: "nextjs", name: "Next.js", color: "background: #111827; color: #fff;" },
  {
    id: "architecture",
    name: "Architecture",
    color: "background: #f59e0b; color: #fff;",
  },
  {
    id: "typescript",
    name: "TypeScript",
    color: "background: #007acc; color: #fff;",
  },
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
    content: `
<img src="/guide-seo-debutant.png" />
<p>
  Vous avez terminé votre site web, peaufiné le design et rédigé votre contenu…
  il est enfin temps de publier.<br />Mais ensuite ?<br />Bienvenue dans le
  monde du <strong>SEO</strong> — Search Engine Optimization ou référencement
  naturel.
</p>
<p>
  Ce guide simplifié vous permettra de comprendre les bases du SEO et vous
  donnera les clés pour positionner votre site efficacement dans les résultats
  de recherche.
</p>
<h3>🎯 Points clés</h3>
<ul>
  <li>
    Le SEO vise à améliorer la visibilité de votre site et à attirer du trafic
    organique (non payant).
  </li>
  <li>
    Il comprend : la recherche de mots-clés, le SEO on-page, off-page et
    technique.
  </li>
  <li>
    C’est un travail de long terme, qui nécessite de suivre vos performances,
    rester à jour et optimiser régulièrement votre contenu.
  </li>
</ul>
<h3>🔍 Qu’est-ce que le SEO ?</h3>
<p>
  C’est un ensemble de techniques permettant à votre site d’apparaître plus haut
  dans les résultats des moteurs de recherche comme Google. L’objectif : capter
  un maximum de trafic qualifié, gratuitement.
</p>
<p>Les moteurs évaluent trois grands critères :</p>
<ul>
  <li>La pertinence du contenu</li>
  <li>La crédibilité du site</li>
  <li>L’expérience utilisateur (vitesse, accessibilité mobile…)</li>
</ul>
<h3>📈 Pourquoi le SEO est-il important ?</h3>
<ul>
  <li>Générer un trafic gratuit et durable</li>
  <li>Devenir une autorité dans votre domaine</li>
  <li>Offrir une expérience utilisateur optimale</li>
  <li>Devancer vos concurrents</li>
</ul>
<h3>🔑 Recherche de mots-clés : la base du SEO</h3>
<p>
  Les mots-clés sont les expressions que vos utilisateurs tapent sur Google.
  Utilisez des outils comme Originality.ai, Ahrefs ou SEMrush pour :
</p>
<ul>
  <li>Identifier les mots-clés pertinents</li>
  <li>
    Analyser l’intention de recherche (informationnelle, transactionnelle, etc.)
  </li>
  <li>
    Cibler des mots-clés de longue traîne plus précis et moins concurrentiels
  </li>
</ul>
<h3>🧱 SEO On-Page : Optimiser votre contenu</h3>
<ul>
  <li>
    <strong>Titres & Méta-descriptions</strong> : incluez les mots-clés
    principaux dès le début
  </li>
  <li><strong>Structure d’URL</strong> : claire, courte, avec des tirets</li>
  <li><strong>Balises H1, H2, H3</strong> : pour organiser le contenu</li>
  <li><strong>Liens internes</strong> : pour améliorer la navigation</li>
  <li><strong>Optimisation des images</strong> : compression et balises ALT</li>
  <li><strong>Responsive Design</strong> : indispensable pour le mobile</li>
</ul>
<h3>🔗 SEO Off-Page : Renforcer votre autorité</h3>
<p>
  Le SEO off-page repose sur les backlinks — liens provenant d’autres sites
  crédibles :
</p>
<ul>
  <li>Rédigez des articles invités</li>
  <li>Collaborez avec des influenceurs ou journalistes</li>
  <li>Créez du contenu unique à forte valeur ajoutée</li>
</ul>
<p>
  <em
    >Attention aux techniques de liens douteuses qui enfreignent les règles de
    Google.</em
  >
</p>
<h3>⚙️ SEO Technique : Optimisez les performances</h3>
<ul>
  <li>Vitesse de chargement : Google privilégie les sites rapides</li>
  <li>Sitemap XML : pour faciliter l’indexation</li>
  <li>Google Search Console : pour détecter les erreurs</li>
</ul>
<h3>📊 Suivi & Analyse</h3>
<p>Le SEO est un processus continu. Utilisez ces outils :</p>
<ul>
  <li>Google Analytics : trafic, taux de rebond</li>
  <li>Search Console : erreurs d’indexation</li>
  <li>Originality.ai : scores d’optimisation</li>
  <li>Ahrefs / SEMrush / Moz : suivi des mots-clés et backlinks</li>
</ul>
<p>Indicateurs importants à suivre :</p>
<ul>
  <li>Trafic organique</li>
  <li>Classement des mots-clés</li>
  <li>Taux de clics (CTR)</li>
  <li>Taux de rebond</li>
  <li>Autorité de domaine (DA)</li>
</ul>
<h3>🚀 Prêt à vous lancer ?</h3>
<p>
  Le SEO est un investissement sur le long terme. Les résultats ne sont pas
  immédiats, mais les efforts réguliers paient.
</p>
<p>
  Restez informé, optimisez votre contenu, et privilégiez la qualité à la
  quantité.<br />Continuez à apprendre sur le blog d’Originality.ai avec des
  articles comme :
</p>
<ul>
  <li>Marketing de contenu B2B vs B2C</li>
  <li>Utiliser l’IA pour le clustering de sujets</li>
  <li>Optimisation des pages d’atterrissage</li>
  <li>Meilleurs outils SEO basés sur l’IA</li>
</ul>
`,
    categories: ["seo"],
    author: "Mohamad Al-Khatib",
    publishedAt: "2025-05-23",
    readTime: 7,
  },
  {
    id: "10-erreurs-refonte-site-web",
    title:
      "10 erreurs courantes en refonte de site web (et comment les éviter)",
    description:
      "Découvrez les pièges les plus fréquents lors d’une refonte de site web et nos conseils concrets pour les prévenir.",
    content: `
<img src="/erreurs-refonte.png" />

<p>
  La refonte d’un site web est un projet stratégique, mais il est facile de
  tomber dans certains pièges. Pour vous aider à mener une refonte sans
  accrocs, voici les <strong>10 erreurs les plus courantes</strong> et
  comment les éviter.
</p>

<h3>1. Négliger l’audit SEO avant la refonte</h3>
<p>
  Sans audit SEO préalable, vous risquez de perdre vos mots-clés performants,
  vos backlinks et votre ancienneté dans les résultats de recherche. Pour
  l’éviter :
</p>
<ul>
  <li>Réalisez un audit complet du référencement actuel (pages à fort trafic, backlinks, positionnement de mots-clés).</li>
  <li>Exportez la structure des URLs et notez leurs performances.</li>
  <li>Prévoyez un <code>301</code> pour chaque URL modifiée afin de préserver le "jus SEO".</li>
</ul>

<h3>2. Oublier de sauvegarder et versionner l’existant</h3>
<p>
  Sans sauvegarde, une erreur technique peut effacer votre site actuel.
  Sans contrôle de version, vous ne pourrez pas revenir en arrière. Pour éviter
  ces risques :
</p>
<ul>
  <li>Mettez en place un système de backup régulier (fichiers, base de données, configurations).</li>
  <li>Utilisez Git pour versionner le code et créez une branche dédiée à la refonte.</li>
  <li>Testez la restauration de vos sauvegardes avant la mise en production.</li>
</ul>

<h3>3. Ne pas établir d’objectifs clairs et mesurables</h3>
<p>
  Sans objectifs (réduction du temps de chargement, amélioration du taux de
  conversion, hausse du trafic organique…), vous ne pourrez pas mesurer le
  succès de la refonte. Pensez à :
</p>
<ul>
  <li>Définir des KPIs précis (temps de chargement, taux de rebond, positionnement sur mots-clés).</li>
  <li>Documenter les valeurs de référence avant la refonte (benchmarks).</li>
  <li>Fixer des objectifs SMART (exemple : « réduire de 20 % le temps de chargement d’ici 3 mois »).</li>
</ul>

<h3>4. Modifier la structure des URLs sans plan de redirection</h3>
<p>
  Rouleau compresseur sur la structure d’URLs = 404 assurées pour les
  visiteurs et Google. Pour l’éviter :
</p>
<ul>
  <li>Listez toutes les URLs existantes via un crawler (Screaming Frog, etc.).</li>
  <li>Établissez un mapping anciennes ➡ nouvelles URLs et configurez des redirections 301.</li>
  <li>Vérifiez post-lancement qu’aucune 404 n’apparaît et que les redirections fonctionnent.</li>
</ul>

<h3>5. Ignorer l’impact sur le maillage interne et les liens externes</h3>
<p>
  Les changements d’URLs brisent vos liens internes et vos backlinks. Pour
  limiter la casse :
</p>
<ul>
  <li>Identifiez les pages les plus liées (audit du maillage interne).</li>
  <li>Mettre à jour les liens internes après refonte.</li>
  <li>Prévenez vos partenaires pour qu’ils mettent à jour les liens externes, ou configurez des 301 en dernier recours.</li>
</ul>

<h3>6. Négliger la performance (vitesse de chargement)</h3>
<p>
  Un site lent fait fuir les visiteurs et pénalise votre SEO. Pour garder la
  fluidité :
</p>
<ul>
  <li>Mesurez les Core Web Vitals (LCP, FID, CLS) avant et après la refonte.</li>
  <li>Optimisez les images (compression, WebP, lazy loading).</li>
  <li>Combinez et minifiez CSS/JS, chargez les scripts tiers en différé.</li>
  <li>Activez un système de cache (Redis, CDN, plugins de cache CMS).</li>
</ul>

<h3>7. Omettre de tester sur différents navigateurs et appareils</h3>
<p>
  Un site qui fonctionne sur Chrome desktop ne l’est pas forcément sur Firefox
  ou Safari mobile. Pour éviter les mauvaises surprises :
</p>
<ul>
  <li>Définissez la liste des navigateurs et versions cibles (Chrome, Firefox, Safari, Edge, etc.).</li>
  <li>Utilisez BrowserStack ou LambdaTest pour des tests automatisés cross-browser.</li>
  <li>Faites des tests manuels sur smartphones et tablettes (iOS, Android).</li>
  <li>Corrigez les préfixes CSS et ajoutez les polyfills nécessaires pour le JS moderne.</li>
</ul>

<h3>8. Sous‐estimer l’importance de l’expérience utilisateur (UX)</h3>
<p>
  Se concentrer uniquement sur la technologie ou le design esthétique sans se
  mettre à la place de l’utilisateur peut générer une interface confuse. Pensez à :
</p>
<ul>
  <li>Réaliser des tests utilisateurs sur une maquette interactive.</li>
  <li>Concevoir une arborescence logique via un tri de cartes (card sorting).</li>
  <li>Simplifier les parcours de conversion (CTA visibles, formulaires courts).</li>
  <li>Réfléchir responsive dès la conception (touch targets, zone cliquable suffisante).</li>
</ul>

<h3>9. Ne pas impliquer toutes les parties prenantes</h3>
<p>
  Impliquer uniquement le chef de projet ou les devs sans consulter marketing,
  commerciaux ou support porte le risque de ne pas répondre aux besoins métiers.
  Pour éviter les incompréhensions :
</p>
<ul>
  <li>Organisez des ateliers de cadrage avec toutes les équipes concernées.</li>
  <li>Rédigez un cahier des charges détaillé (user stories, spécifications fonctionnelles).</li>
  <li>Validez les wireframes/graphiques auprès des équipes avant développement.</li>
  <li>Prévoyez une formation pour les nouveaux back-offices ou outils mis en place.</li>
</ul>

<h3>10. Oublier le suivi post-mise en ligne et la maintenance continue</h3>
<p>
  Lancer le site, c’est bien ; le faire évoluer et le protéger, c’est
  indispensable. Pour une maintenance pérenne :
</p>
<ul>
  <li>Activez Google Analytics, Search Console et un outil de monitoring des Core Web Vitals.</li>
  <li>Planifiez des tests de performance réguliers (PageSpeed, GTmetrix).</li>
  <li>Mettez en place un contrat de maintenance (mises à jour CMS/plugins, backups hors site).</li>
  <li>Collectez les retours utilisateurs via un formulaire de feedback.</li>
  <li>Analysez l’évolution des leads et ajustez le tunnel de conversion si nécessaire (A/B testing).</li>
</ul>

<p>
  En évitant ces dix erreurs, vous maximisez vos chances d’obtenir une refonte
  réussie, performante et alignée avec vos objectifs business.
</p>
`,
    categories: ["refonte"],
    author: "Mohamad Al-Khatib",
    publishedAt: "2025-06-02",
    readTime: 8,
  },

  {
    id: "nextjs-drizzle-stack",
    title:
      "Pourquoi j’utilise Next.js 15 et Drizzle ORM pour créer des apps modernes",
    description:
      "Next.js 15 et Drizzle ORM forment une stack puissante, moderne et typée pour construire des applications web rapides, maintenables et scalables. Voici pourquoi je les utilise au quotidien.",
    content: `
<img src="/nextjs-drizzle.png" alt="Stack Next.js + Drizzle ORM" />

<p>
  Aujourd’hui, créer une application web performante, rapide et évolutive ne se limite plus à “faire du React”. En tant que développeur freelance spécialisé en JavaScript, j’ai testé de nombreux outils, frameworks et ORM au fil des projets. Mais depuis plusieurs mois, une combinaison s’est imposée naturellement dans mon workflow : <strong>Next.js 15 + Drizzle ORM</strong>.
</p>

<p>Dans cet article, je t’explique pourquoi ce stack me permet de livrer des applications modernes, robustes, et pourquoi c’est un vrai plus pour mes clients.</p>

<h3>🚀 Next.js 15 : bien plus qu’un framework React</h3>
<p>
  Next.js est devenu un framework fullstack complet. Depuis la version 13, et encore plus avec la 15, il offre :
</p>
<ul>
  <li><strong>App Router</strong> : architecture modulaire ultra claire</li>
  <li><strong>Server & Client components</strong> : rendu optimisé</li>
  <li><strong>Edge rendering & streaming</strong> : performance maximale</li>
  <li><strong>Layouts imbriqués</strong> : pour des interfaces complexes et réactives</li>
  <li><strong>SEO natif</strong> : gestion fine avec l’API <code>metadata.ts</code></li>
</ul>
<p>
  Avec Next.js, je peux déployer une app performante dès les premiers jours, sans recoder toute l’architecture backend. C’est un vrai gain de temps.
</p>

<h3>🧩 Drizzle ORM : typage natif, requêtes claires, simplicité</h3>
<p>
  J’ai longtemps utilisé Prisma, Knex, Sequelize… mais Drizzle ORM a changé ma vision :
</p>
<ul>
  <li><strong>Typage TypeScript natif</strong>, pas de génération de client</li>
  <li><strong>Syntaxe proche du SQL</strong>, simple et lisible</li>
  <li><strong>API .query</strong> très puissante pour structurer les requêtes</li>
  <li><strong>Pas de magie noire</strong> : tout est explicite</li>
</ul>

<pre><code>const result = await db.query.users.findMany({
  where: (u, { eq }) => eq(u.email, "client@example.com"),
});
</code></pre>

<p>Le typage est strict mais confortable, la productivité est excellente, et surtout : <strong>le code est maintenable</strong>.</p>

<h3>🔧 La puissance de la combinaison Next.js + Drizzle</h3>
<p>
  Ces deux outils s’intègrent parfaitement dans une architecture monorepo :
</p>
<ul>
  <li>Typage TypeScript de bout en bout</li>
  <li>Back et front dans le même repo</li>
  <li>Performance + structure + rapidité de dev</li>
  <li>API Routes ou Server Actions très faciles à implémenter</li>
</ul>

<p>Je peux ainsi développer une application fullstack complète, optimisée et lisible sans sacrifier la scalabilité ou la qualité du code.</p>

<h3>🧪 Cas concret : AlertJO.fr</h3>
<p>
  Pour <a href="https://alertjo.fr" target="_blank">AlertJO.fr</a>, j’ai utilisé ce stack pour créer une app qui :
</p>
<ul>
  <li>Scrape les PDF des journaux officiels</li>
  <li>Extrait les noms et numéros de dossier</li>
  <li>Permet une recherche rapide par numéro</li>
  <li>Envoie des notifications email en cas de correspondance</li>
</ul>

<p>
  Résultat : une app légère, rapide, maintenable, et un SEO bien structuré pour capter les bons utilisateurs.
</p>

<h3>🎯 Pourquoi c’est un avantage pour mes clients</h3>
<ul>
  <li>Des apps modernes et scalables</li>
  <li>Un rendu rapide et fluide</li>
  <li>Un code lisible, structuré et typé</li>
  <li>Un gain de temps dans les évolutions futures</li>
</ul>

<p>
  Mon objectif en tant que freelance, ce n’est pas juste d’écrire du code. C’est de livrer des solutions techniques fiables, performantes, maintenables et bien conçues.
</p>

<h3>📬 Un projet web en tête ?</h3>
<p>
  Je peux t’accompagner, du concept à la mise en ligne. Discutons de ton besoin :
</p>
<ul>
  <li><a href="mailto:mohamad@mk-web.fr">mohamad@mk-web.fr</a></li>
  <li><a href="https://mk-web.fr#services">Voir mes services</a></li>
</ul>
`,
    categories: ["tech", "nextjs", "typescript"],
    author: "Mohamad Al-Khatib",
    publishedAt: "2025-06-18",
    readTime: 3,
  },
  {
    id: "structure-nextjs-monorepo",
    title:
      "Structurer un projet Next.js en monorepo : bonnes pratiques et retour d’expérience",
    description:
      "Comment organiser un projet Next.js en architecture monorepo ? Avantages, outils, structure de dossiers, et conseils issus de mon expérience sur des applications à fort volume.",
    content: `
<img src="/nextjs-monorepo.png" alt="Structure monorepo Next.js" />

<p>
  Quand on développe une application Next.js qui va grandir dans le temps — avec plusieurs modules, backends, composants partagés — une architecture monorepo devient rapidement une nécessité. Après plusieurs projets, je partage ici mes bonnes pratiques pour structurer un projet Next.js en monorepo de manière propre, maintenable et scalable.
</p>

<h3>📦 Pourquoi passer au monorepo ?</h3>
<ul>
  <li><strong>Centraliser le front, l’API, les librairies partagées</strong></li>
  <li><strong>Réduire la duplication de code</strong> (types, logique métier)</li>
  <li><strong>Simplifier les mises à jour</strong> dans tous les modules</li>
  <li><strong>Mieux gérer les permissions / CI / tests</strong></li>
</ul>

<p>Un monorepo bien structuré permet aussi de travailler à plusieurs sans écraser les autres modules.</p>

<h3>🧰 Outils recommandés</h3>
<ul>
  <li><strong>Turborepo</strong> (ou Nx) pour le build en cache</li>
  <li><strong>pnpm</strong> avec workspaces pour une résolution rapide des dépendances</li>
  <li><strong>TypeScript</strong> avec <code>projectReferences</code></li>
  <li><strong>ESLint + Prettier</strong> configurés au niveau racine</li>
</ul>

<h3>📁 Structure de base d’un monorepo Next.js</h3>

<pre><code>my-app/
├── apps/
│   ├── web/         → l’app Next.js principale
│   └── admin/       → interface d’administration
├── packages/
│   ├── ui/          → composants partagés (design system)
│   ├── config/      → config Tailwind, ESLint, etc.
│   └── db/          → ORM, schémas Drizzle, helpers DB
├── .gitignore
├── package.json
├── turbo.json
└── tsconfig.json
</code></pre>

<p>Chaque sous-projet peut avoir ses propres dépendances tout en accédant aux packages communs via les <code>workspaces</code>.</p>

<h3>🔄 Exemple d’usage : composants partagés</h3>
<p>
  Le dossier <code>packages/ui</code> contient des composants comme <code>&lt;Button /&gt;</code>, <code>&lt;Card /&gt;</code>, <code>&lt;Layout /&gt;</code>, tous écrits en TypeScript et stylés avec Tailwind.
</p>

<pre><code>// packages/ui/button.tsx
export function Button({ children }) {
  return (
    &lt;button className="rounded-xl px-4 py-2 bg-orange-500 text-white"&gt;
      {children}
    &lt;/button&gt;
  );
}
</code></pre>

<p>Ensuite, tu l’importes depuis <code>apps/web</code> :</p>

<pre><code>import { Button } from "@ui/button";
</code></pre>

<h3>🧪 Tests et typage partagé</h3>
<p>
  Dans <code>packages/types</code>, je place tous mes types partagés entre front, back et API. Ça permet d’avoir un typage strict, notamment pour les données récupérées avec Drizzle ORM.
</p>

<p>
  Pour les tests, chaque app peut embarquer son propre Jest/Vitest, ou on peut mutualiser des helpers dans <code>packages/test-utils</code>.
</p>

<h3>🚀 Déploiement et CI/CD</h3>
<ul>
  <li><strong>Vercel</strong> supporte nativement Turborepo</li>
  <li><strong>Github Actions</strong> ou <strong>Husk</strong> pour valider les PR</li>
  <li>Déploiement par app (web, admin…) en ciblant uniquement ce qui a changé</li>
</ul>


<h3>🎯 Ce qu’un monorepo bien structuré change pour mes clients</h3>
<ul>
  <li>Maintenance facilitée, même avec plusieurs apps</li>
  <li>Un seul point de vérité pour les types, composants, fonctions</li>
  <li>Une cohérence visuelle et technique sur tout le produit</li>
  <li>Une scalabilité réelle sur le long terme</li>
</ul>

<h3>📩 Tu veux une architecture propre dès le début ?</h3>
<p>
  J’accompagne les startups et les projets web ambitieux dans leur structuration technique, que ce soit en création ou refonte.<br />
  👉 <a href="https://mk-web.fr#services">Voir mes services</a><br />
  👉 <a href="mailto:mohamad@mk-web.fr">mohamad@mk-web.fr</a>
</p>
`,
    categories: ["nextjs", "architecture", "typescript"],
    author: "Mohamad Al-Khatib",
    publishedAt: "2025-06-17",
    readTime: 3,
  },
];
