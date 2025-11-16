import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  pageExtensions: ["js", "md", "mdx", "ts", "tsx"],
  images: {
    domains: [
      "pbxt.replicate.delivery",
      "g4yqcv8qdhf169fk.public.blob.vercel-storage.com",
    ],
  },
  trailingSlash: true,
};

const withMDX = createMDX({
  // Add markdown plugins here, as desired
});

export default withMDX(nextConfig);
