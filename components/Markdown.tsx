import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";

// GitHub-flavored markdown: bold, italic, links, code blocks (with syntax
// highlighting), inline code, lists, task lists, tables, blockquotes,
// footnotes, images, and raw HTML. Same renderer for articles + live preview.
export default function Markdown({ children }: { children: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      components={{
        a: ({ node, ...props }) => <a target="_blank" rel="noopener noreferrer" {...props} />,
      }}
    >
      {children}
    </ReactMarkdown>
  );
}
