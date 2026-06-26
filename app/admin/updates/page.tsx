import { getUpdates } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { moodByKey } from "@/lib/site";
import UpdateComposer from "@/components/UpdateComposer";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Updates" };

export default async function AdminUpdates() {
  const updates = await getUpdates();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="nimbus uppercase tracking-wide text-sm mb-5">Post a daily update</h1>
      <UpdateComposer />

      <h2 className="nimbus uppercase tracking-wide text-sm text-gray-400 mt-12 mb-4">
        Posted ({updates.length})
      </h2>
      {updates.length === 0 ? (
        <p className="text-sm text-gray-400">No updates yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800">
          {updates.map((u) => {
            const mood = moodByKey(u.mood);
            return (
              <div key={u.id} className="py-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: mood.color }}>
                    <span aria-hidden>{mood.emoji}</span>
                    {mood.label}
                  </span>
                  <div className="flex items-center gap-4">
                    <time className="text-xs text-gray-400">{formatDateTime(u.createdAt)}</time>
                    <DeleteButton url={`/api/updates?id=${encodeURIComponent(u.id)}`} />
                  </div>
                </div>
                <p className="font-serif text-[1.0625rem] leading-relaxed text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                  {u.text}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
