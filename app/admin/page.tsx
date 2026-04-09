"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Eye,
  Users,
  MessageSquare,
  TrendingUp,
  PenSquare,
  Clock,
  ArrowRight,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Stats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalComments: number;
  pendingComments: number;
  totalSubscribers: number;
  totalViews: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentComments, setRecentComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats);
        setRecentPosts(data.recentPosts || []);
        setRecentComments(data.recentComments || []);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Posts", value: stats?.totalPosts || 0, icon: FileText, color: "text-brand-400", bg: "bg-brand-500/10" },
    { label: "Total Views", value: stats?.totalViews || 0, icon: Eye, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Subscribers", value: stats?.totalSubscribers || 0, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10" },
    { label: "Comments", value: stats?.totalComments || 0, icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-500/10" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-zinc-500 text-sm mt-1">Welcome back, Prabal</p>
        </div>
        <Link href="/admin/posts/new" className="btn-primary">
          <PenSquare className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-zinc-500 text-sm">{card.label}</span>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold">{card.value.toLocaleString()}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-400 rounded-full" />
          <span className="text-sm text-zinc-400">Published:</span>
          <span className="font-bold">{stats?.publishedPosts || 0}</span>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-400 rounded-full" />
          <span className="text-sm text-zinc-400">Drafts:</span>
          <span className="font-bold">{stats?.draftPosts || 0}</span>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-red-400 rounded-full" />
          <span className="text-sm text-zinc-400">Pending Comments:</span>
          <span className="font-bold">{stats?.pendingComments || 0}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Posts</h2>
            <Link href="/admin/posts" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="text-zinc-500 text-sm">No posts yet</p>
          ) : (
            <div className="space-y-3">
              {recentPosts.map((post: any) => (
                <Link
                  key={post._id}
                  href={`/admin/posts/${post.slug}/edit`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate group-hover:text-brand-400 transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        post.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-amber-500/10 text-amber-400"
                      }`}>
                        {post.status}
                      </span>
                      <span className="text-xs text-zinc-600 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {post.views}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-600 ml-4 flex-shrink-0">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Comments */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">Recent Comments</h2>
            <Link href="/admin/comments" className="text-brand-400 text-sm hover:text-brand-300 flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          {recentComments.length === 0 ? (
            <p className="text-zinc-500 text-sm">No comments yet</p>
          ) : (
            <div className="space-y-3">
              {recentComments.map((comment: any) => (
                <div key={comment._id} className="p-3 rounded-lg bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white">{comment.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      comment.approved
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {comment.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2">{comment.content}</p>
                  <span className="text-[10px] text-zinc-600 mt-1 block">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
