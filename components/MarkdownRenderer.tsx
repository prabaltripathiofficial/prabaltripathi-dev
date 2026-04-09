"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function isHTML(content: string): boolean {
  return /<[a-z][\s\S]*>/i.test(content.trim().slice(0, 100));
}

export default function MarkdownRenderer({ content }: { content: string }) {
  if (isHTML(content)) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
}
