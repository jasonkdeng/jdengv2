import { notFound } from "next/navigation";
import Link from "next/link";
import { BlogProgressNav } from "@/components/blog-progress-nav";
import { formatPostedOn, getAllBlogPosts, getBlogPostBySlug } from "@/lib/blog-data";

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article id="blog-article" className="space-y-5">
      <BlogProgressNav />
      <header className="space-y-2">
        <Link href="/blog" className="blog-back-link">
          back to blog list
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{post.title}</h1>
        <div className="blog-post-meta">
          <span>{formatPostedOn(post.postedOn)}</span>
          <span>{post.theme}</span>
        </div>
      </header>

      <section className="blog-prose">
        <post.Content />
      </section>
    </article>
  );
}
