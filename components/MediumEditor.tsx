"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Typography from "@tiptap/extension-typography";
import { Markdown } from "tiptap-markdown";
import { useEffect, useCallback, useRef } from "react";
import toast from "react-hot-toast";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Highlighter,
  Undo,
  Redo,
  Unlink,
  Upload,
  Loader2,
} from "lucide-react";
import { useState } from "react";

interface MediumEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function MediumEditor({ content, onChange }: MediumEditorProps) {
  const isInitialized = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith("image/")) {
      toast.error("Only image files are allowed");
      return null;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return null;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        toast.success("Image uploaded");
        return data.url;
      } else {
        toast.error(data.error || "Upload failed");
        return null;
      }
    } catch {
      toast.error("Upload failed");
      return null;
    } finally {
      setUploading(false);
    }
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: { HTMLAttributes: { class: "code-block" } },
      }),
      Image.configure({ inline: false, allowBase64: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "editor-link" },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: false }),
      Typography,
      Markdown.configure({
        html: true,
        transformPastedText: true,
        transformCopiedText: true,
      }),
    ],
    content: "",
    editorProps: {
      attributes: {
        class: "medium-editor-content",
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.length) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            uploadImage(file).then((url) => {
              if (url && editor) {
                const { pos } = view.posAtCoords({ left: event.clientX, top: event.clientY }) || { pos: view.state.selection.from };
                editor.chain().focus().setImage({ src: url }).run();
              }
            });
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              event.preventDefault();
              const file = items[i].getAsFile();
              if (file) {
                uploadImage(file).then((url) => {
                  if (url && editor) {
                    editor.chain().focus().setImage({ src: url }).run();
                  }
                });
              }
              return true;
            }
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      try {
        const md = (editor.storage as any)?.markdown?.getMarkdown?.();
        if (md && md.trim()) {
          onChange(md);
          return;
        }
      } catch {}
      // Fallback to HTML
      const html = editor.getHTML();
      if (html && html !== "<p></p>") {
        onChange(html);
      }
    },
  });

  useEffect(() => {
    if (editor && content && !isInitialized.current) {
      editor.commands.setContent(content);
      isInitialized.current = true;
    }
  }, [editor, content]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const handleImageFromUrl = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const url = await uploadImage(file);
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
    // Reset input so same file can be selected again
    e.target.value = "";
  }, [editor, uploadImage]);

  if (!editor) return null;

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-md transition-all ${
        disabled
          ? "text-zinc-700 cursor-not-allowed"
          : active
          ? "bg-white/[0.1] text-white"
          : "text-zinc-500 hover:text-white hover:bg-white/[0.05]"
      }`}
    >
      {children}
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-white/[0.08] mx-1" />;

  return (
    <div className="medium-editor-wrapper">
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Fixed Toolbar */}
      <div className="sticky top-0 z-10 bg-[#0d0d14]/95 backdrop-blur-lg border border-white/[0.06] rounded-xl p-2 mb-4 flex items-center gap-0.5 flex-wrap">
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
          <Undo className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
          <Redo className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Cmd+B)"
        >
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Cmd+I)"
        >
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Cmd+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          active={editor.isActive("highlight")}
          title="Highlight"
        >
          <Highlighter className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={editor.isActive("code")}
          title="Inline Code"
        >
          <Code className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 className="w-4 h-4" />
        </ToolbarButton>

        <Divider />

        <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Add Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>
        {editor.isActive("link") && (
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetLink().run()}
            title="Remove Link"
          >
            <Unlink className="w-4 h-4" />
          </ToolbarButton>
        )}

        <Divider />

        {/* Image upload button */}
        <ToolbarButton
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          title="Upload Image"
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        </ToolbarButton>
        <ToolbarButton onClick={handleImageFromUrl} title="Image from URL">
          <ImageIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Divider"
        >
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Upload indicator */}
      {uploading && (
        <div className="flex items-center gap-2 px-4 py-2 mb-3 bg-brand-500/10 border border-brand-500/20 rounded-lg text-brand-400 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading image...
        </div>
      )}

      {/* Editor */}
      <EditorContent editor={editor} />

      {/* Helper text */}
      <div className="mt-3 flex items-center gap-4 text-xs text-zinc-600">
        <span>Drag & drop images anywhere</span>
        <span>Paste images from clipboard</span>
        <span>Or use the upload button above</span>
      </div>
    </div>
  );
}
