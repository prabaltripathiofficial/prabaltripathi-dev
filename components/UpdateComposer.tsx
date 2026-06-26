"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOODS } from "@/lib/site";

export default function UpdateComposer() {
  const [mood, setMood] = useState(MOODS[0].key);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function post() {
    if (!text.trim()) return setError("Say something first.");
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, text }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Failed");
      setText("");
      router.refresh();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <div className="flex flex-wrap gap-2 mb-3">
        {MOODS.map((m) => {
          const active = m.key === mood;
          return (
            <button
              key={m.key}
              onClick={() => setMood(m.key)}
              className="px-3 py-1.5 rounded-full text-sm border transition"
              style={{
                borderColor: active ? m.color : "transparent",
                background: active ? `${m.color}1a` : "transparent",
                color: active ? m.color : undefined,
              }}
            >
              <span aria-hidden>{m.emoji}</span> {m.label}
            </button>
          );
        })}
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") post();
        }}
        placeholder="What are you building? How are you feeling?"
        rows={3}
        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2.5 font-serif text-[1.0625rem] leading-relaxed resize-none focus:outline-none focus:border-primary-600"
      />
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">{error || "⌘↵ to post"}</span>
        <button
          onClick={post}
          disabled={busy}
          className="rounded bg-primary-600 text-white px-4 py-1.5 text-sm hover:bg-primary-500 transition disabled:opacity-50"
        >
          {busy ? "Posting…" : "Post update"}
        </button>
      </div>
    </div>
  );
}
