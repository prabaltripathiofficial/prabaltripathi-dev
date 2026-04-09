import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Eye, Search, Tag } from "lucide-react";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on engineering, system design, developer tooling, and more by Prabal Tripathi.",
};

async function getData(search?: string, tag?: string) {
  await connectDB();

  const query: any = { status: "published" };
  if (tag) query.tags = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { excerpt: { $regex: search, $options: "i" } },
      { tags: { $regex: search, $options: "i" } },
    ];
  }

  const posts = await Post.find(query).sort({ publishedAt: -1 }).lean();

  // Get all unique tags
  const allPosts = await Post.find({ status: "published" }).select("tags").lean();
  const tags = Array.from(new Set(allPosts.flatMap((p: any) => p.tags))).filter(Boolean);

  return {
    posts: JSON.parse(JSON.stringify(posts)),
    tags,
  };
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { search?: string; tag?: string };
}) {
  const { posts, tags } = await getData(searchParams.search, searchParams.tag);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-secondary text-lg">
            Thoughts on engineering, system design, and the tools I build.
          </p>
        </section>

        {/* Search & Filters */}
        <section className="mb-10">
          <form action="/blog" method="GET" className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                defaultValue={searchParams.search}
                className="input-field pl-11"
              />
            </div>
          </form>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Link
                href="/blog"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  !searchParams.tag
                    ? "bg-brand-600 text-primary"
                    : "bg-white/[0.04] text-secondary hover:text-primary hover:bg-white/[0.08] border border-white/[0.06]"
                }`}
              >
                All
              </Link>
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${encodeURIComponent(tag)}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    searchParams.tag === tag
                      ? "bg-brand-600 text-primary"
                      : "bg-white/[0.04] text-secondary hover:text-primary hover:bg-white/[0.08] border border-white/[0.06]"
                  }`}
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Posts */}
        {posts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-secondary text-lg mb-2">No articles found</p>
            <p className="text-zinc-600 text-sm">
              {searchParams.search || searchParams.tag
                ? "Try a different search term or filter."
                : "Check back soon for new content!"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post: any) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="glass-card-hover p-6 block group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {post.coverImage && (
                    <div className="w-full md:w-48 h-32 rounded-xl overflow-hidden bg-white/[0.03] flex-shrink-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 text-xs text-muted mb-2">
                      {post.publishedAt && (
                        <time>
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readingTime} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-primary group-hover:text-brand-400 transition-colors mb-2 line-clamp-1">
                      {post.title}
                    </h2>

                    <p className="text-muted text-sm leading-relaxed line-clamp-2 mb-3">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {post.tags?.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-white/[0.04] text-muted text-xs rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Newsletter */}
        <section className="mt-16 glass-card p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Subscribe to my Newsletter</h2>
          <p className="text-secondary mb-6 max-w-md mx-auto">
            Get notified when I publish new articles. No spam, unsubscribe anytime.
          </p>
          <div className="max-w-sm mx-auto">
            <NewsletterForm />
          </div>
        </section>
      </div>
    </div>
  );
}
