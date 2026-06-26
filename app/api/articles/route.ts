import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import { createArticle, deleteArticle } from "@/lib/store";

export async function POST(req: Request) {
  if (!isOwner()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !b.title || !b.content) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }
  const { slug } = await createArticle({
    slug: b.slug || b.title,
    title: b.title,
    date: b.date || new Date().toISOString().slice(0, 10),
    description: b.description || "",
    content: b.content,
  });
  return NextResponse.json({ ok: true, slug });
}

export async function DELETE(req: Request) {
  if (!isOwner()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Missing slug." }, { status: 400 });
  await deleteArticle(slug);
  return NextResponse.json({ ok: true });
}
