import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticle } from "@/lib/store";
import { formatDate } from "@/lib/format";
import Markdown from "@/components/Markdown";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getArticle(params.slug);
  if (!post) return {};
  return { title: post.title, description: post.description };
}

// Individual article — same content structure as the reference site.
export default async function Article({ params }: { params: { slug: string } }) {
  const post = await getArticle(params.slug);
  if (!post) notFound();

  return (
    <div className="flex flex-1 items-start">
      <div className="w-full md:w-9/12">
        <h1 className="nimbus text-3xl leading-tight mb-4 md:mb-11">{post.title}</h1>
        <div className="md:hidden text-sm mb-8 relative -top-px text-gray-400">
          {formatDate(post.date)}
        </div>
        <div className="-mt-[5px] prose">
          <Markdown>{post.content}</Markdown>
        </div>
      </div>
    </div>
  );
}
