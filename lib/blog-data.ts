import type { ComponentType } from "react";

export const BLOG_THEMES = [
  "Robots",
  "Software",
  "Life",
  "Nature",
  "Other",
] as const;

export type BlogTheme = (typeof BLOG_THEMES)[number];

export type BlogPostMetadata = {
  slug: string;
  title: string;
  postedOn: string;
  theme: BlogTheme;
  summary?: string;
};

export type BlogPost = BlogPostMetadata & {
  Content: ComponentType;
};

type MDXModule = {
  default: ComponentType;
  metadata: BlogPostMetadata;
};

type WebpackRequireContext = {
  keys(): string[];
  <T>(id: string): T;
};

// webpack require.context – automatically picks up every .mdx file in content/blog/.
// To add a new post, just drop an .mdx file there with a `metadata` export.
const mdxContext = (
  require as unknown as {
    context(dir: string, useSubdirs: boolean, filter: RegExp): WebpackRequireContext;
  }
).context("../content/blog", false, /\.mdx$/);

const mdxPosts: BlogPost[] = mdxContext.keys().map((key) => {
  const mod = mdxContext<MDXModule>(key);
  return {
    ...(mod.metadata as BlogPostMetadata),
    Content: mod.default,
  };
});

function sortByNewest(posts: BlogPost[]) {
  return [...posts].sort(
    (a, b) => new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime(),
  );
}

export function getAllBlogPosts() {
  return sortByNewest(mdxPosts);
}

export function getBlogPostBySlug(slug: string) {
  return mdxPosts.find((post) => post.slug === slug);
}

export function formatPostedOn(isoDate: string) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
