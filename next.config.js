import createMDX from '@next/mdx';
import remarkFrontmatter from 'remark-frontmatter';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    domains: [
      'pbxt.replicate.delivery',
      'g4yqcv8qdhf169fk.public.blob.vercel-storage.com',
    ],
  },
  trailingSlash: true,
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      remarkFrontmatter,
      // Strip frontmatter from output
      () => (tree) => {
        tree.children = tree.children.filter(
          (node) => node.type !== 'yaml' && node.type !== 'toml'
        );
      },
    ],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
