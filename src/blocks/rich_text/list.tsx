import { cn } from "../../utils/cn";
import { InlineElement } from "./elements";
import type { RichTextListElement } from "./types";

// Slack nests lists via an `indent` count — a `rich_text_list` can appear
// inside another via the same structure. We honour that by padding per
// indent level. Slack's `offset` / `border` are rarely used; we ignore
// them for now.

export function RichTextList({ block }: { block: RichTextListElement }) {
  const Tag = block.style === "ordered" ? "ol" : "ul";
  const marker =
    block.style === "ordered" ? "list-decimal" : "list-disc";
  const indent = Math.max(0, block.indent ?? 0);
  return (
    <Tag
      data-rich-text="list"
      data-style={block.style}
      className={cn(
        marker,
        "space-y-1 pl-6",
        indent > 0 && `ml-${Math.min(indent * 4, 16)}`,
      )}
    >
      {block.elements.map((section, i) => (
        <li key={i} className="whitespace-pre-wrap break-words">
          {section.elements.map((el, j) => (
            <InlineElement key={j} element={el} />
          ))}
        </li>
      ))}
    </Tag>
  );
}
