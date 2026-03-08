import Link from "next/link";
import { BlogThemeFilter } from "@/components/blog-theme-filter";
import { BLOG_THEMES, formatPostedOn, getAllBlogPosts } from "@/lib/blog-data";

type BlogIndexPageProps = {
  searchParams?: Promise<{
    theme?: string;
  }>;
};

export default async function BlogIndexPage({ searchParams }: BlogIndexPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const selectedTheme = BLOG_THEMES.includes(
    resolvedSearchParams?.theme as (typeof BLOG_THEMES)[number],
  )
    ? (resolvedSearchParams?.theme as (typeof BLOG_THEMES)[number])
    : "All";

  const allPosts = getAllBlogPosts();
  const filteredPosts =
    selectedTheme === "All"
      ? allPosts
      : allPosts.filter((post) => post.theme === selectedTheme);

  const recentPosts = filteredPosts.slice(0, 3);
  const olderPosts = filteredPosts.slice(3);

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <BlogThemeFilter selectedTheme={selectedTheme} />
      </div>

      <div className="space-y-2">
        {recentPosts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-listing-row">
            <span>{post.title}</span>
            <span>{formatPostedOn(post.postedOn)}</span>
            <span>{post.theme}</span>
          </Link>
        ))}
      </div>

      {olderPosts.length > 0 ? (
        <details className="blog-older-dropdown">
          <summary>Older posts</summary>
          <div className="mt-3 space-y-2">
            {olderPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="blog-listing-row">
                <span>{post.title}</span>
                <span>{formatPostedOn(post.postedOn)}</span>
                <span>{post.theme}</span>
              </Link>
            ))}
          </div>
        </details>
      ) : null}
    </section>
  );
}
