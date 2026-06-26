import { NextResponse } from "next/server";
import { getUpdates, getArticles } from "@/lib/store";

export const dynamic = "force-dynamic";

// Read-only diagnostic: which storage driver is live, and does it read?
// Exposes only counts and a coarse error message — never the connection string.
export async function GET() {
  const driver = process.env.POSTGRES_URL ? "postgres" : "file";
  const out: Record<string, unknown> = { driver };
  try {
    const updates = await getUpdates();
    out.updatesCount = updates.length;
  } catch (e: any) {
    out.updatesError = String(e?.message || e).slice(0, 200);
  }
  try {
    const articles = await getArticles();
    out.articlesCount = articles.length;
  } catch (e: any) {
    out.articlesError = String(e?.message || e).slice(0, 200);
  }
  return NextResponse.json(out);
}
