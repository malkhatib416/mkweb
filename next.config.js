/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "pbxt.replicate.delivery",
      "g4yqcv8qdhf169fk.public.blob.vercel-storage.com",
    ],
  },
};

module.exports = nextConfig;
