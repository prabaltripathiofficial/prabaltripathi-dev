"use client";

import { useState, FormEvent } from "react";
import { MessageSquare, Send, Loader2, User } from "lucide-react";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  _id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

export default function CommentSection({
  postSlug,
  comments: initialComments,
}: {
  postSlug: string;
  comments: Comment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !email || !content) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${postSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, content }),
      });

      if (res.ok) {
        toast.success("Comment submitted! It will appear after approval.");
        setName("");
        setEmail("");
        setContent("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to post comment");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <MessageSquare className="w-5 h-5 text-brand-400" />
        <h3 className="text-xl font-bold">
          Comments {comments.length > 0 && `(${comments.length})`}
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="glass-card p-6 mb-8">
        <h4 className="font-semibold mb-4">Leave a comment</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="input-field"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="input-field"
          />
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment..."
          required
          rows={4}
          className="input-field resize-none mb-3"
        />
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" /> Post Comment
            </>
          )}
        </button>
        <p className="text-xs text-zinc-600 mt-2">
          Comments are moderated and will appear after approval.
        </p>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-muted">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="glass-card p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-brand-600/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <span className="font-medium text-sm text-primary">{comment.name}</span>
                  <span className="text-xs text-zinc-600 ml-2">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="text-secondary text-sm leading-relaxed pl-11">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
