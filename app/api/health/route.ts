import { NextResponse } from "next/server";
import { getUpdates, getArticles } from "@/lib/store";

export const dynamic = "force-dynamic";

// Minimal read-only health check.
export async function GET() {
  const driver = process.env.POSTGRES_URL ? "postgres" : "file";
  const out: Record<string, unknown> = { driver };
  try {
    out.articles = (await getArticles()).length;
    out.updates = (await getUpdates()).length;
  } catch (e: any) {
    out.error = String(e?.message || e).slice(0, 200);
  }
  return NextResponse.json(out);
}
