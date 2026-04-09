"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  Save,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";

const MediumEditor = dynamic(() => import("@/components/MediumEditor"), { ssr: false });

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("General");
  const [coverImage, setCoverImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

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
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (status: "draft" | "published") => {
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: excerpt || title,
          content,
          tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
          category,
          coverImage,
          status,
        }),
      });

      if (res.ok) {
        toast.success(status === "published" ? "Post published!" : "Draft saved!");
        router.push("/admin/posts");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <h1 className="text-2xl font-bold">New Post</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSubmit("draft")}
            disabled={saving}
            className="btn-secondary"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </button>
          <button
            onClick={() => handleSubmit("published")}
            disabled={saving}
            className="btn-primary"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
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
            placeholder="Write a brief excerpt that appears in blog listings..."
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

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Cover Image */}
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
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-secondary w-full text-sm"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
          </div>

          {/* Category */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Category</h3>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field text-sm"
            >
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

          {/* Tags */}
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

          {/* Writing Tips */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3 text-brand-400">Editor Tips</h3>
            <ul className="space-y-1.5 text-xs text-zinc-500">
              <li>Select text to see the floating toolbar</li>
              <li>Use the toolbar for headings, lists, quotes</li>
              <li>Paste URLs to auto-create links</li>
              <li>Use code button for inline code blocks</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
