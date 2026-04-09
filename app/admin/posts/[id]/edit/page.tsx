"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
  ArrowLeft,
  Eye,
} from "lucide-react";
import toast from "react-hot-toast";

const MediumEditor = dynamic(() => import("@/components/MediumEditor"), { ssr: false });

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("General");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then((res) => res.json())
      .then((post) => {
        setTitle(post.title || "");
        setExcerpt(post.excerpt || "");
        setContent(post.content || "");
        setTags(post.tags?.join(", ") || "");
        setCategory(post.category || "General");
        setCoverImage(post.coverImage || "");
        setStatus(post.status || "draft");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        setCoverImage(data.url);
        toast.success("Image uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (newStatus?: "draft" | "published") => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: excerpt || title,
          content,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          category,
          coverImage,
          status: newStatus || status,
        }),
      });

      if (res.ok) {
        const updatedStatus = newStatus || status;
        setStatus(updatedStatus);
        toast.success(updatedStatus === "published" ? "Post published!" : "Changes saved!");
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin/posts")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">Edit Post</h1>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              status === "published"
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-amber-500/10 text-amber-400"
            }`}>
              {status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {status === "published" && (
            <a href={`/blog/${slug}`} target="_blank" className="btn-ghost text-sm">
              <Eye className="w-4 h-4" /> Preview
            </a>
          )}
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="btn-secondary"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title..."
            className="w-full text-3xl font-bold bg-transparent border-none outline-none text-white placeholder:text-zinc-700"
          />

          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Brief excerpt..."
            rows={2}
            className="input-field resize-none"
          />

          <div className="glass-card p-4">
            <MediumEditor
              content={content}
              onChange={setContent}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Cover Image</h3>
            {coverImage ? (
              <div className="relative rounded-lg overflow-hidden mb-3">
                <img src={coverImage} alt="Cover" className="w-full h-32 object-cover" />
                <button
                  onClick={() => setCoverImage("")}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : null}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={uploading} className="btn-secondary w-full text-sm">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Category</h3>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field text-sm">
              <option value="General">General</option>
              <option value="Engineering">Engineering</option>
              <option value="System Design">System Design</option>
              <option value="DevOps">DevOps</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Career">Career</option>
              <option value="Tutorial">Tutorial</option>
            </select>
          </div>

          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Tags</h3>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="React, Node.js, MongoDB..."
              className="input-field text-sm"
            />
            <p className="text-xs text-zinc-600 mt-1.5">Comma separated</p>
          </div>
        </div>
      </div>
    </div>
  );
}
