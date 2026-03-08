import type { ComponentType } from "react";
import FirstBlogPost, { metadata as firstBlogPostMeta } from "@/content/blog/first-blog-post.mdx";

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

// Register new MDX posts here. Listing and static route generation use this source of truth.
const mdxPosts: BlogPost[] = [
  {
    ...(firstBlogPostMeta as BlogPostMetadata),
    Content: FirstBlogPost,
  },
];

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
