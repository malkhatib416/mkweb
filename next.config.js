import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        hostname: 'pbxt.replicate.delivery',
      },
      {
        hostname: 'g4yqcv8qdhf169fk.public.blob.vercel-storage.com',
      },
    ],
  },
  // Disabled: trailing slash breaks Better Auth API route matching (/api/auth/sign-in/email/ 404)
  trailingSlash: false,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
