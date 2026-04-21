import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { useComponent } from "../components-registry";

// The markdown *block* differs from mrkdwn text objects — it carries
// full CommonMark + GFM markdown, not Slack's mrkdwn dialect. Upstream
// renders it via `react-markdown` + `remark-gfm` for tables, strike,
// task lists, etc. We match that architecture exactly; mrkdwn text
// objects keep using Phase K's Yozora pipeline.

export interface MarkdownBlockData {
  type: "markdown";
  block_id?: string;
  text: string;
}

export function MarkdownBlock({ block }: { block: MarkdownBlockData }) {
  const size = useSize();
  const InlineLink = useComponent("InlineLink");
  return (
    <div
      data-block="markdown"
      className={cn(
        "prose prose-sm max-w-none break-words",
        "[&_p]:my-2 [&_ul]:list-disc [&_ol]:list-decimal",
        sizing[size].body,
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className={cn("mb-2 font-semibold", sizing[size].header)}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="mb-2 text-base font-semibold">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mb-1 text-sm font-semibold">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="mb-1 text-sm font-semibold">{children}</h4>
          ),
          p: ({ children }) => <p>{children}</p>,
          a: ({ href, children }) => (
            <InlineLink href={href ?? ""}>{children}</InlineLink>
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !/language-\w+/.test(className ?? "");
            if (isInline) {
              return (
                <code
                  className="rounded bg-muted px-1 font-mono text-[0.85em]"
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-2 overflow-x-auto rounded-md bg-muted px-3 py-2 font-mono text-xs whitespace-pre-wrap">
              {children}
            </pre>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-border pl-3 text-muted-foreground">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-1 pl-6">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-1 pl-6">{children}</ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          table: ({ children }) => (
            <div className="my-2 overflow-x-auto">
              <table className="w-full border-collapse border border-border">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          tbody: ({ children }) => <tbody>{children}</tbody>,
          tr: ({ children }) => (
            <tr className="border-b border-border">{children}</tr>
          ),
          th: ({ children, style }) => (
            <th
              className="border-r border-border px-3 py-2 text-left font-semibold last:border-r-0"
              style={style as React.CSSProperties}
            >
              {children}
            </th>
          ),
          td: ({ children, style }) => (
            <td
              className="border-r border-border px-3 py-2 last:border-r-0"
              style={style as React.CSSProperties}
            >
              {children}
            </td>
          ),
          hr: () => <hr className="my-3 border-border" />,
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => (
            <del className="line-through">{children}</del>
          ),
          input: ({ type, checked, disabled }) =>
            type === "checkbox" ? (
              <input
                type="checkbox"
                checked={!!checked}
                disabled={disabled}
                readOnly
                className="mr-1 accent-primary"
              />
            ) : null,
        }}
      >
        {block.text}
      </ReactMarkdown>
    </div>
  );
}
