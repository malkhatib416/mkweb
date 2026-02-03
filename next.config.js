import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  // Allow dev server requests from other devices on the network (e.g. 192.168.x.x)
  allowedDevOrigins: ['http://192.168.1.28:3003', 'http://192.168.1.28:3000'],
  images: {
    remotePatterns: [
      {
        hostname: 'pbxt.replicate.delivery',
      },
      {
        hostname: 'g4yqcv8qdhf169fk.public.blob.vercel-storage.com',
      },
      // MinIO (local or custom host). Add your MinIO host if different.
      { hostname: '0.0.0.0', pathname: '/uploads/**' },
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
