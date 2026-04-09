import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, Eye, Calendar, Tag, Share2 } from "lucide-react";
import { connectDB } from "@/lib/db";
import Post from "@/lib/models/Post";
import Comment from "@/lib/models/Comment";
import CommentSection from "@/components/CommentSection";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import NewsletterForm from "@/components/NewsletterForm";

async function getPost(slug: string) {
  await connectDB();
  const post = await Post.findOne({ slug });
  if (!post) return null;

  // Increment views
  await Post.updateOne({ slug }, { $inc: { views: 1 } });

  const comments = await Comment.find({ postSlug: slug, approved: true })
    .sort({ createdAt: -1 })
    .lean();

  // Get related posts by tags
  const related = await Post.find({
    status: "published",
    slug: { $ne: slug },
    tags: { $in: post.tags },
  })
    .limit(3)
    .sort({ publishedAt: -1 })
    .lean();

  return {
    post: JSON.parse(JSON.stringify(post)),
    comments: JSON.parse(JSON.stringify(comments)),
    related: JSON.parse(JSON.stringify(related)),
  };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  await connectDB();
  const post = await Post.findOne({ slug: params.slug }).lean();
  if (!post) return { title: "Post Not Found" };

  return {
    title: (post as any).title,
    description: (post as any).excerpt,
    openGraph: {
      title: (post as any).title,
      description: (post as any).excerpt,
      type: "article",
      publishedTime: (post as any).publishedAt,
      authors: [(post as any).author],
      tags: (post as any).tags,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const data = await getPost(params.slug);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-zinc-400 mb-6">This article doesn&apos;t exist.</p>
          <Link href="/blog" className="btn-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  const { post, comments, related } = data;

  return (
    <div className="pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-6">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags?.map((tag: string) => (
              <Link
                key={tag}
                href={`/blog?tag=${encodeURIComponent(tag)}`}
                className="px-2.5 py-1 bg-brand-600/10 text-brand-400 text-xs font-medium rounded-md border border-brand-500/10 hover:bg-brand-600/20 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-6">
            {post.title}
          </h1>

          <p className="text-lg text-zinc-400 leading-relaxed mb-6">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-6 text-sm text-zinc-500 pb-8 border-b border-white/[0.06]">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Draft"}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {post.readingTime} min read
            </span>
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4" />
              {post.views + 1} views
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="w-full rounded-2xl overflow-hidden mb-10 border border-white/[0.06]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose-custom mb-12">
          <MarkdownRenderer content={post.content} />
        </div>

        {/* Share */}
        <div className="py-6 border-t border-b border-white/[0.06] mb-12">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Enjoyed this article?</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-500 mr-2">Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://prabal.dev/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all text-xs"
              >
                X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://prabal.dev/blog/${post.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.08] transition-all text-xs"
              >
                in
              </a>
            </div>
          </div>
        </div>

        {/* Newsletter CTA */}
        <div className="glass-card p-8 text-center mb-12">
          <h3 className="text-xl font-bold mb-2">Enjoyed this read?</h3>
          <p className="text-zinc-400 text-sm mb-4">Subscribe to get notified about new articles.</p>
          <div className="max-w-sm mx-auto">
            <NewsletterForm compact />
          </div>
        </div>

        {/* Comments */}
        <CommentSection postSlug={post.slug} comments={comments} />

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16">
            <h3 className="text-xl font-bold mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {related.map((r: any) => (
                <Link
                  key={r._id}
                  href={`/blog/${r.slug}`}
                  className="glass-card-hover p-5 group"
                >
                  <h4 className="font-semibold text-white group-hover:text-brand-400 transition-colors text-sm line-clamp-2 mb-2">
                    {r.title}
                  </h4>
                  <p className="text-zinc-500 text-xs line-clamp-2">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
