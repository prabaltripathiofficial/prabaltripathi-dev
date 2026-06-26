import { NextResponse } from "next/server";
import { isOwner } from "@/lib/auth";
import { createUpdate, deleteUpdate } from "@/lib/store";
import { MOODS } from "@/lib/site";

export async function POST(req: Request) {
  if (!isOwner()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json().catch(() => null);
  if (!b || !b.text || !b.text.trim()) {
    return NextResponse.json({ error: "Say something first." }, { status: 400 });
  }
  const mood = MOODS.some((m) => m.key === b.mood) ? b.mood : MOODS[0].key;
  const u = await createUpdate(mood, String(b.text).slice(0, 1000));
  return NextResponse.json({ ok: true, update: u });
}

export async function DELETE(req: Request) {
  if (!isOwner()) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await deleteUpdate(id);
  return NextResponse.json({ ok: true });
}
