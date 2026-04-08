export const ADMIN_ACCOUNT = {
  email: 'mohamad@mk-web.fr',
  password: '@btA847E$3pw2fGW483',
  name: 'Mohamad Al-Khatib',
} as const;

export const TEST_ACCOUNT = {
  email: 'test@mk-web.fr',
  password: 'test123123123',
  name: 'Test Name',
} as const;

export const LANGUAGES_TO_SEED = [
  { code: 'fr', name: 'French' },
  { code: 'en', name: 'English' },
] as const;

export const CATEGORIES_TO_SEED = [
  { name: 'SEO', slug: 'seo', description: 'Référencement et visibilité' },
  { name: 'Refonte', slug: 'refonte', description: 'Refonte de site' },
  { name: 'Tech', slug: 'tech', description: 'Technologie' },
  { name: 'Next.js', slug: 'nextjs', description: 'Next.js' },
  {
    name: 'Architecture',
    slug: 'architecture',
    description: 'Architecture web',
  },
  { name: 'TypeScript', slug: 'typescript', description: 'TypeScript' },
  {
    name: 'Technique',
    slug: 'technique',
    description: 'Développement technique',
  },
] as const;
