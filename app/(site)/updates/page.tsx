import { getUpdates } from "@/lib/store";
import { formatDateTime } from "@/lib/format";
import { moodByKey } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata = { title: "Updates" };

// Daily updates — a stream of short notes: mood + text + date.
export default async function Updates() {
  const updates = await getUpdates();

  return (
    <div className="flex flex-1 items-start space-x-4">
      <div className="w-full md:w-9/12">
        {updates.length === 0 ? (
          <div className="prose -mt-[5px]">
            <p>No updates yet — check back soon.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800 -mt-[14px]">
            {updates.map((u) => {
              const mood = moodByKey(u.mood);
              return (
                <div key={u.id} className="py-5">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-medium"
                      style={{ color: mood.color }}
                    >
                      <span aria-hidden>{mood.emoji}</span>
                      {mood.label}
                    </span>
                    <time className="text-sm text-gray-400">{formatDateTime(u.createdAt)}</time>
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
    </div>
  );
}
