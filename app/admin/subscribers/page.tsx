"use client";

import { useEffect, useState } from "react";
import { Users, Mail, Loader2, Calendar } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/subscribe")
      .then((res) => res.json())
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscribers</h1>
        <p className="text-zinc-500 text-sm mt-1">
          {subscribers.length} active subscriber{subscribers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
        </div>
      ) : subscribers.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Users className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
          <p className="text-zinc-400">No subscribers yet</p>
          <p className="text-zinc-600 text-sm mt-1">They&apos;ll show up here when people subscribe to your newsletter.</p>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3">Email</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3">Name</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub._id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-400" />
                      <span className="text-sm text-white">{sub.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-zinc-400">{sub.name || "—"}</td>
                  <td className="px-6 py-4 text-sm text-zinc-500">
                    {formatDistanceToNow(new Date(sub.subscribedAt || sub.createdAt), { addSuffix: true })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
