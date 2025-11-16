/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'pbxt.replicate.delivery',
      'g4yqcv8qdhf169fk.public.blob.vercel-storage.com',
    ],
  },
  i18n: {
    locales: ['default', 'fr', 'en'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
