"use client";

import { useEffect, useState } from "react";
import {
  MessageSquare,
  Check,
  X,
  Trash2,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const fetchComments = async () => {
    // Fetch all posts first, then get comments for each
    const postsRes = await fetch("/api/posts?all=true&limit=100");
    const postsData = await postsRes.json();
    const posts = postsData.posts || [];

    const allComments: any[] = [];
    for (const post of posts) {
      const res = await fetch(`/api/posts/${post.slug}/comments?all=true`);
      const data = await res.json();
      if (Array.isArray(data)) {
        allComments.push(...data.map((c: any) => ({ ...c, postTitle: post.title })));
      }
    }

    setComments(allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLoading(false);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleApprove = async (comment: any) => {
    const res = await fetch(`/api/posts/${comment.postSlug}/comments`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId: comment._id, approved: !comment.approved }),
    });

    if (res.ok) {
      setComments(
        comments.map((c) =>
          c._id === comment._id ? { ...c, approved: !c.approved } : c
        )
      );
      toast.success(comment.approved ? "Comment unapproved" : "Comment approved");
    }
  };

  const handleDelete = async (comment: any) => {
    if (!confirm("Delete this comment?")) return;

    // We'll need to create a delete endpoint or use the existing one
    // For now, we'll just unapprove it
    toast.error("Delete functionality requires a dedicated API endpoint");
  };

  const filteredComments = comments.filter((c) => {
    if (filter === "pending") return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Comments</h1>
          <p className="text-zinc-500 text-sm mt-1">
            {comments.filter((c) => !c.approved).length} pending approval
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-brand-600/10 text-brand-400 border border-brand-500/10"
                : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-red-500/10 text-red-400 text-xs rounded-full">
                {comments.filter((c) => !c.approved).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
          <p className="text-zinc-400">No {filter !== "all" ? filter : ""} comments</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => (
            <div key={comment._id} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-white text-sm">{comment.name}</span>
                    <span className="text-xs text-zinc-600">{comment.email}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      comment.approved
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {comment.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-zinc-600">
                      on <a href={`/blog/${comment.postSlug}`} target="_blank" className="text-brand-400 hover:text-brand-300">
                        {comment.postTitle || comment.postSlug}
                        <ExternalLink className="w-3 h-3 inline ml-1" />
                      </a>
                    </span>
                    <span className="text-xs text-zinc-700">&middot;</span>
                    <span className="text-xs text-zinc-600">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleApprove(comment)}
                    className={`p-1.5 rounded-lg transition-all ${
                      comment.approved
                        ? "hover:bg-amber-500/10 text-emerald-400 hover:text-amber-400"
                        : "hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-400"
                    }`}
                    title={comment.approved ? "Unapprove" : "Approve"}
                  >
                    {comment.approved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <p className="text-zinc-300 text-sm leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
