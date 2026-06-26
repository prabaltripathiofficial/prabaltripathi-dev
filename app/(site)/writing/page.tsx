import { getArticles } from "@/lib/store";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

// WRITING index — list of posts, newest first (same layout as the reference).
export default async function Writing() {
  const posts = await getArticles();

  return (
    <div className="flex flex-1 items-start space-x-4">
      <div className="w-full md:w-9/12">
        {posts.length === 0 ? (
          <div className="prose -mt-[5px]">
            <p>Nothing published yet — writing is on the way.</p>
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-gray-100 dark:divide-zinc-800 -mt-[14px]">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/writing/${post.slug}`}
                className="text-gray-900 dark:text-gray-100 hover:opacity-70 transition-all"
              >
                <div className="flex pb-4 md:pb-2 pt-3 flex-col md:flex-row items-start">
                  <div className="flex-auto md:w-9/12 relative top-[2px]">
                    <h2 className="nimbus text-lg leading-snug">{post.title}</h2>
                  </div>
                  <div className="md:w-3/12 md:pl-4 md:shrink-0 text-sm relative top-px text-gray-400">
                    {formatDate(post.date)}
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
