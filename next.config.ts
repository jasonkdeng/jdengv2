import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-math"],
    rehypePlugins: ["rehype-katex"],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  images: {
    qualities: [75, 82],
  },
  turbopack: {
    // Ensure CSS/PostCSS imports resolve from this app folder, not a parent directory.
    root: __dirname,
  },
};

export default withMDX(nextConfig);
