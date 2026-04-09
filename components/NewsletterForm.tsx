"use client";

import { useState, FormEvent } from "react";
import { Send, Loader2, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubscribed(true);
        setEmail("");
        setName("");
        toast.success("You're subscribed! Welcome aboard.");
      } else {
        toast.error(data.error || "Something went wrong");
      }
    } catch {
      toast.error("Failed to subscribe. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (subscribed) {
    return (
      <div className={`flex items-center gap-2 ${compact ? "text-sm" : "text-base"} text-emerald-400`}>
        <CheckCircle className="w-4 h-4" />
        <span>You&apos;re subscribed!</span>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className="flex-1 px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-brand-500/50 transition-colors"
        />
        <button
          type="submit"
          disabled={loading}
          className="p-2 bg-brand-600 hover:bg-brand-500 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name (optional)"
        className="input-field"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="input-field"
      />
      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Send className="w-4 h-4" />
            Subscribe to Newsletter
          </>
        )}
      </button>
    </form>
  );
}
