import fs from "fs";
import path from "path";
import crypto from "crypto";
import matter from "gray-matter";
import { unstable_noStore as noStore } from "next/cache";

// Storage layer with two drivers:
//   • Postgres (@vercel/postgres) when POSTGRES_URL is set  → production
//   • local files when it isn't                             → dev / demo
// The public API is identical either way.

export type ArticleMeta = { slug: string; title: string; date: string; description?: string };
export type Article = ArticleMeta & { content: string };
export type Update = { id: string; mood: string; text: string; createdAt: string };

const usePg = !!process.env.POSTGRES_URL;

const WRITING_DIR = path.join(process.cwd(), "content/writing");
const UPDATES_FILE = path.join(process.cwd(), "content/updates.json");

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// --------------------------------------------------------------------------
// Postgres driver
// --------------------------------------------------------------------------
let schemaReady: Promise<void> | null = null;
async function pg() {
  const mod = await import("@vercel/postgres");
  const sql = mod.sql;
  if (!schemaReady) {
    schemaReady = (async () => {
      await sql`CREATE TABLE IF NOT EXISTS articles (
        slug text PRIMARY KEY,
        title text NOT NULL,
        date text NOT NULL,
        description text DEFAULT '',
        content text NOT NULL,
        created_at timestamptz DEFAULT now()
      )`;
      await sql`CREATE TABLE IF NOT EXISTS updates (
        id text PRIMARY KEY,
        mood text NOT NULL,
        text text NOT NULL,
        created_at timestamptz DEFAULT now()
      )`;
    })();
  }
  await schemaReady;
  return sql;
}

// --------------------------------------------------------------------------
// Articles
// --------------------------------------------------------------------------
export async function getArticles(): Promise<ArticleMeta[]> {
  noStore(); // never serve a cached list — DB is the source of truth
  if (usePg) {
    const sql = await pg();
    const { rows } = await sql`SELECT slug, title, date, description FROM articles ORDER BY date DESC`;
    return rows as ArticleMeta[];
  }
  if (!fs.existsSync(WRITING_DIR)) return [];
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const { data } = matter(fs.readFileSync(path.join(WRITING_DIR, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: data.title ?? file,
        date: data.date ?? "",
        description: data.description ?? "",
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getArticle(slug: string): Promise<Article | null> {
  noStore();
  if (usePg) {
    const sql = await pg();
    const { rows } = await sql`SELECT slug, title, date, description, content FROM articles WHERE slug = ${slug}`;
    return (rows[0] as Article) || null;
  }
  const fp = path.join(WRITING_DIR, `${slug}.md`);
  if (!fs.existsSync(fp)) return null;
  const { data, content } = matter(fs.readFileSync(fp, "utf8"));
  return {
    slug,
    title: data.title ?? slug,
    date: data.date ?? "",
    description: data.description ?? "",
    content,
  };
}

export async function createArticle(a: Article): Promise<{ slug: string }> {
  const slug = slugify(a.slug || a.title);
  if (usePg) {
    const sql = await pg();
    await sql`INSERT INTO articles (slug, title, date, description, content)
      VALUES (${slug}, ${a.title}, ${a.date}, ${a.description ?? ""}, ${a.content})
      ON CONFLICT (slug) DO UPDATE SET title = ${a.title}, date = ${a.date},
        description = ${a.description ?? ""}, content = ${a.content}`;
    return { slug };
  }
  fs.mkdirSync(WRITING_DIR, { recursive: true });
  const fm = [
    "---",
    `title: ${JSON.stringify(a.title)}`,
    `date: ${JSON.stringify(a.date)}`,
    `description: ${JSON.stringify(a.description ?? "")}`,
    "---",
    "",
    a.content,
    "",
  ].join("\n");
  fs.writeFileSync(path.join(WRITING_DIR, `${slug}.md`), fm, "utf8");
  return { slug };
}

export async function deleteArticle(slug: string): Promise<void> {
  if (usePg) {
    const sql = await pg();
    await sql`DELETE FROM articles WHERE slug = ${slug}`;
    return;
  }
  const fp = path.join(WRITING_DIR, `${slug}.md`);
  if (fs.existsSync(fp)) fs.unlinkSync(fp);
}

// --------------------------------------------------------------------------
// Daily updates
// --------------------------------------------------------------------------
export async function getUpdates(): Promise<Update[]> {
  noStore(); // never serve a cached list — DB is the source of truth
  if (usePg) {
    const sql = await pg();
    const { rows } = await sql`SELECT id, mood, text, created_at FROM updates ORDER BY created_at DESC`;
    return rows.map((r: any) => ({
      id: r.id,
      mood: r.mood,
      text: r.text,
      createdAt: new Date(r.created_at).toISOString(),
    }));
  }
  if (!fs.existsSync(UPDATES_FILE)) return [];
  try {
    const arr = JSON.parse(fs.readFileSync(UPDATES_FILE, "utf8")) as Update[];
    return arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

export async function createUpdate(mood: string, text: string): Promise<Update> {
  const u: Update = {
    id: crypto.randomUUID(),
    mood,
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };
  if (usePg) {
    const sql = await pg();
    await sql`INSERT INTO updates (id, mood, text) VALUES (${u.id}, ${u.mood}, ${u.text})`;
    return u;
  }
  const all = fs.existsSync(UPDATES_FILE)
    ? (JSON.parse(fs.readFileSync(UPDATES_FILE, "utf8")) as Update[])
    : [];
  all.push(u);
  fs.mkdirSync(path.dirname(UPDATES_FILE), { recursive: true });
  fs.writeFileSync(UPDATES_FILE, JSON.stringify(all, null, 2), "utf8");
  return u;
}

export async function deleteUpdate(id: string): Promise<void> {
  if (usePg) {
    const sql = await pg();
    await sql`DELETE FROM updates WHERE id = ${id}`;
    return;
  }
  if (!fs.existsSync(UPDATES_FILE)) return;
  const all = (JSON.parse(fs.readFileSync(UPDATES_FILE, "utf8")) as Update[]).filter((u) => u.id !== id);
  fs.writeFileSync(UPDATES_FILE, JSON.stringify(all, null, 2), "utf8");
}
