import { NextResponse } from "next/server";
import { getUpdates, getArticles, getArticle } from "@/lib/store";

export const dynamic = "force-dynamic";

// Temporary deep diagnostic: compares what each query path sees.
export async function GET() {
  const driver = process.env.POSTGRES_URL ? "postgres" : "file";
  const out: Record<string, unknown> = { driver };

  try {
    const articles = await getArticles();
    out.getArticles_count = articles.length;
    out.getArticles_slugs = articles.map((a) => a.slug);
  } catch (e: any) {
    out.getArticles_error = String(e?.message || e).slice(0, 300);
  }

  try {
    const updates = await getUpdates();
    out.getUpdates_count = updates.length;
  } catch (e: any) {
    out.getUpdates_error = String(e?.message || e).slice(0, 300);
  }

  try {
    const one = await getArticle("lets-make-dockers-duck");
    out.getArticle_dockers = one ? { slug: one.slug, title: one.title } : null;
  } catch (e: any) {
    out.getArticle_error = String(e?.message || e).slice(0, 300);
  }

  if (driver === "postgres") {
    try {
      const { sql } = await import("@vercel/postgres");
      const a = await sql`SELECT count(*)::int AS c FROM articles`;
      const u = await sql`SELECT count(*)::int AS c FROM updates`;
      const slugs = await sql`SELECT slug FROM articles LIMIT 20`;
      out.raw_articles = a.rows[0].c;
      out.raw_updates = u.rows[0].c;
      out.raw_slugs = slugs.rows.map((r: any) => r.slug);
    } catch (e: any) {
      out.raw_error = String(e?.message || e).slice(0, 300);
    }
  }

  return NextResponse.json(out);
}
