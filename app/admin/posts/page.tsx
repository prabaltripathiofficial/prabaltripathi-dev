"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  PenSquare,
  Trash2,
  Eye,
  Clock,
  Search,
  FileText,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    const params = new URLSearchParams({ all: "true", limit: "100" });
    if (search) params.set("search", search);

    const res = await fetch(`/api/posts?${params}`);
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    fetchPosts();
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;

    const res = await fetch(`/api/posts/${slug}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Post deleted");
      setPosts(posts.filter((p) => p.slug !== slug));
    } else {
      toast.error("Failed to delete post");
    }
  };

  const toggleStatus = async (slug: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";
    const res = await fetch(`/api/posts/${slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      toast.success(`Post ${newStatus === "published" ? "published" : "unpublished"}`);
      setPosts(posts.map((p) => (p.slug === slug ? { ...p, status: newStatus } : p)));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Posts</h1>
          <p className="text-zinc-500 text-sm mt-1">{posts.length} total posts</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <PenSquare className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="input-field pl-11"
          />
        </div>
      </form>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : posts.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FileText className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
          <p className="text-zinc-400">No posts yet. Create your first article!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (
            <div key={post._id} className="glass-card-hover p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <Link
                  href={`/admin/posts/${post.slug}/edit`}
                  className="font-medium text-white hover:text-brand-400 transition-colors truncate block"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    post.status === "published"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {post.status}
                  </span>
                  <span className="text-xs text-zinc-600 flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {post.views}
                  </span>
                  <span className="text-xs text-zinc-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {post.readingTime}m
                  </span>
                  <span className="text-xs text-zinc-600">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleStatus(post.slug, post.status)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all ${
                    post.status === "published"
                      ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  {post.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <Link
                  href={`/admin/posts/${post.slug}/edit`}
                  className="p-2 rounded-lg hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-all"
                >
                  <PenSquare className="w-4 h-4" />
                </Link>
                <button
                  onClick={() => handleDelete(post.slug, post.title)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-zinc-400 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
