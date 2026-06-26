"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ url, label = "Delete" }: { url: string; label?: string }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function del() {
    if (!confirm("Delete this? This cannot be undone.")) return;
    setBusy(true);
    await fetch(url, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={del}
      disabled={busy}
      className="text-xs text-gray-400 hover:text-red-500 transition disabled:opacity-50"
    >
      {busy ? "…" : label}
    </button>
  );
}
