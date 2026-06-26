"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Markdown from "@/components/Markdown";

const STARTER = `Write your article here.

You get the full **GitHub-flavored** toolkit: _italics_, [links](https://example.com),
\`inline code\`, lists, quotes, tables, and fenced code blocks:

\`\`\`ts
function hello(name: string) {
  return \`hi, \${name}\`;
}
\`\`\`

> Use the toolbar above or keyboard shortcuts (⌘B, ⌘I, ⌘K).
`;

function todayISO() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function Editor() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [date, setDate] = useState(todayISO());
  const [description, setDescription] = useState("");
  const [body, setBody] = useState(STARTER);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string; href?: string } | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const fileContents = useMemo(() => {
    const fm = [
      "---",
      `title: ${JSON.stringify(title || "Untitled")}`,
      `date: ${JSON.stringify(date)}`,
      `description: ${JSON.stringify(description)}`,
      "---",
      "",
    ].join("\n");
    return fm + "\n" + body + "\n";
  }, [title, date, description, body]);

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const readMin = Math.max(1, Math.round(words / 200));

  function applyToSelection(fn: (sel: string) => { text: string; selStart: number; selLen: number }) {
    const ta = taRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const before = body.slice(0, start);
    const sel = body.slice(start, end);
    const after = body.slice(end);
    const { text, selStart, selLen } = fn(sel);
    setBody(before + text + after);
    const cursor = start + selStart;
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(cursor, cursor + selLen);
    });
  }

  const wrap = (b: string, a: string, ph: string) =>
    applyToSelection((sel) => {
      const inner = sel || ph;
      return { text: b + inner + a, selStart: b.length, selLen: inner.length };
    });

  const linePrefix = (mk: (i: number) => string) =>
    applyToSelection((sel) => {
      const lines = (sel || "list item").split("\n");
      const text = lines.map((l, i) => mk(i) + l).join("\n");
      return { text, selStart: 0, selLen: text.length };
    });

  const block = (b: string, a: string, ph: string) =>
    applyToSelection((sel) => {
      const inner = sel || ph;
      return { text: `${b}${inner}${a}`, selStart: b.length, selLen: inner.length };
    });

  const insertLink = () =>
    applyToSelection((sel) => {
      const label = sel || "text";
      const text = `[${label}](https://)`;
      return { text, selStart: text.length - 1, selLen: 0 };
    });

  const insertTable = () =>
    applyToSelection(() => {
      const text = "\n| Column A | Column B |\n| --- | --- |\n| cell | cell |\n| cell | cell |\n";
      return { text, selStart: text.length, selLen: 0 };
    });

  function onKeyDown(e: React.KeyboardEvent) {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const k = e.key.toLowerCase();
    if (k === "b") { e.preventDefault(); wrap("**", "**", "bold"); }
    else if (k === "i") { e.preventDefault(); wrap("_", "_", "italic"); }
    else if (k === "k") { e.preventDefault(); insertLink(); }
    else if (k === "enter") { e.preventDefault(); save(); }
  }

  async function save() {
    setStatus(null);
    if (!title.trim()) return setStatus({ kind: "err", msg: "Add a title first." });
    if (!slug) return setStatus({ kind: "err", msg: "Add a slug first." });
    setSaving(true);
    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, title, date, description, content: body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setStatus({ kind: "ok", msg: "Published.", href: `/writing/${data.slug}` });
    } catch (err: any) {
      setStatus({ kind: "err", msg: err.message });
    } finally {
      setSaving(false);
    }
  }

  async function copyMd() {
    await navigator.clipboard.writeText(fileContents);
    setStatus({ kind: "ok", msg: "Markdown copied to clipboard." });
  }

  function downloadMd() {
    const blob = new Blob([fileContents], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "untitled"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const TOOL: { label: string; title: string; fn: () => void }[] = [
    { label: "H2", title: "Heading", fn: () => linePrefix(() => "## ") },
    { label: "H3", title: "Subheading", fn: () => linePrefix(() => "### ") },
    { label: "B", title: "Bold (⌘B)", fn: () => wrap("**", "**", "bold") },
    { label: "I", title: "Italic (⌘I)", fn: () => wrap("_", "_", "italic") },
    { label: "S", title: "Strikethrough", fn: () => wrap("~~", "~~", "text") },
    { label: "</>", title: "Inline code", fn: () => wrap("`", "`", "code") },
    { label: "{ }", title: "Code block", fn: () => block("```\n", "\n```", "code") },
    { label: "🔗", title: "Link (⌘K)", fn: insertLink },
    { label: "❝", title: "Quote", fn: () => linePrefix(() => "> ") },
    { label: "•", title: "Bullet list", fn: () => linePrefix(() => "- ") },
    { label: "1.", title: "Numbered list", fn: () => linePrefix((i) => `${i + 1}. `) },
    { label: "✓", title: "Task list", fn: () => linePrefix(() => "- [ ] ") },
    { label: "▦", title: "Table", fn: insertTable },
    { label: "🖼", title: "Image", fn: () => block("![", "](https://)", "alt") },
    { label: "―", title: "Divider", fn: () => block("\n---\n", "", "") },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <span className="nimbus uppercase tracking-wide text-sm">New article</span>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400 mr-2">{words} words · {readMin} min</span>
          <button onClick={copyMd} className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 hover:border-primary-600 transition">
            Copy .md
          </button>
          <button onClick={downloadMd} className="rounded border border-gray-300 dark:border-gray-700 px-3 py-1.5 hover:border-primary-600 transition">
            Download
          </button>
          <button onClick={save} disabled={saving} className="rounded bg-primary-600 text-white px-4 py-1.5 hover:bg-primary-500 transition disabled:opacity-50">
            {saving ? "Publishing…" : "Publish"}
          </button>
        </div>
      </div>

      {status && (
        <div className={`mb-4 text-sm rounded px-3 py-2 ${status.kind === "ok" ? "bg-primary-600/10 text-primary-600 dark:text-secondary-400" : "bg-red-500/10 text-red-500"}`}>
          {status.msg}{" "}
          {status.href && (
            <a href={status.href} className="underline">View it →</a>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title"
          className="md:col-span-6 bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 nimbus text-lg focus:outline-none focus:border-primary-600" />
        <div className="md:col-span-3 flex items-center border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm">
          <span className="text-gray-400 mr-1">/writing/</span>
          <input value={slug} onChange={(e) => { setSlugTouched(true); setSlug(slugify(e.target.value)); }} placeholder="slug"
            className="bg-transparent flex-1 focus:outline-none" />
        </div>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="md:col-span-3 bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-600" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description (for SEO / previews)"
          className="md:col-span-12 bg-transparent border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50">
            {TOOL.map((t) => (
              <button key={t.label} title={t.title} onClick={t.fn}
                className="min-w-[34px] h-8 px-2 text-sm rounded hover:bg-primary-600/10 hover:text-primary-600 dark:hover:text-secondary-400 transition font-mono">
                {t.label}
              </button>
            ))}
          </div>
          <textarea ref={taRef} value={body} onChange={(e) => setBody(e.target.value)} onKeyDown={onKeyDown} spellCheck
            className="flex-1 min-h-[60vh] w-full resize-none bg-transparent p-4 font-mono text-sm leading-relaxed focus:outline-none" />
        </div>

        <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900/50 text-xs uppercase tracking-wide text-gray-400">
            Preview · how it will publish
          </div>
          <div className="p-6 overflow-auto min-h-[60vh]">
            <h1 className="nimbus text-3xl leading-tight mb-2">{title || "Article title"}</h1>
            <div className="text-sm text-gray-400 mb-8">
              {new Date(date + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </div>
            <div className="prose"><Markdown>{body}</Markdown></div>
          </div>
        </div>
      </div>
    </div>
  );
}
