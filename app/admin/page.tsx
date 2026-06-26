import Link from "next/link";
import { getArticles, getUpdates } from "@/lib/store";
import { formatDate, formatDateTime } from "@/lib/format";
import { moodByKey } from "@/lib/site";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function AdminHome() {
  const [articles, updates] = await Promise.all([getArticles(), getUpdates()]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex gap-3 mb-10">
        <Link href="/admin/editor" className="rounded bg-primary-600 text-white px-4 py-2 text-sm hover:bg-primary-500 transition">
          + New article
        </Link>
        <Link href="/admin/updates" className="rounded border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm hover:border-primary-600 transition">
          + Post update
        </Link>
      </div>

      <section className="mb-12">
        <h2 className="nimbus uppercase tracking-wide text-sm text-gray-400 mb-4">
          Articles ({articles.length})
        </h2>
        {articles.length === 0 ? (
          <p className="text-sm text-gray-400">No articles yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {articles.map((a) => (
              <div key={a.slug} className="flex items-center justify-between py-2.5">
                <a href={`/writing/${a.slug}`} className="text-sm hover:text-primary-600 transition">
                  {a.title}
                </a>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-400">{formatDate(a.date)}</span>
                  <DeleteButton url={`/api/articles?slug=${encodeURIComponent(a.slug)}`} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="nimbus uppercase tracking-wide text-sm text-gray-400 mb-4">
          Recent updates ({updates.length})
        </h2>
        {updates.length === 0 ? (
          <p className="text-sm text-gray-400">No updates yet.</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-zinc-800">
            {updates.slice(0, 8).map((u) => {
              const mood = moodByKey(u.mood);
              return (
                <div key={u.id} className="flex items-center justify-between py-2.5 gap-4">
                  <span className="text-sm truncate">
                    <span style={{ color: mood.color }}>{mood.emoji}</span> {u.text}
                  </span>
                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs text-gray-400">{formatDateTime(u.createdAt)}</span>
                    <DeleteButton url={`/api/updates?id=${encodeURIComponent(u.id)}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
