import { Fragment } from "react";
import { cn } from "../../utils/cn";
import { InlineElement } from "./elements";
import type { RichTextListElement } from "./types";

// Ported from upstream `rich_text.tsx` + `rich_text_list_wrapper.tsx`.
// Uses native <ol>/<ul> + CSS `list-style-type` so list markers appear
// visually via the browser ::marker pseudo-element instead of as real
// text nodes (keeps textContent / screen readers clean).
// Offset, border, indent, per-indent marker style are 1:1 with upstream.

interface Props {
  block: RichTextListElement;
  /** Running tally of prior list items at this indent level. */
  consecutive_index: number;
}

function orderedListStyle(indent: number): string {
  if (indent === 1 || indent === 4 || indent === 7) return "lower-alpha";
  if (indent === 2 || indent === 5 || indent === 8) return "lower-roman";
  return "decimal";
}

function unorderedListStyle(indent: number): string {
  if (indent === 1 || indent === 4 || indent === 7) return "circle";
  if (indent === 2 || indent === 5 || indent === 8) return "square";
  return "disc";
}

export function RichTextList({ block, consecutive_index }: Props) {
  const { elements, style, border = 0, indent = 0, offset = 0 } = block;
  const Tag = style === "ordered" ? "ol" : "ul";
  // `<ol start>` picks up the running count + any explicit offset.
  const start = style === "ordered" ? consecutive_index + offset + 1 : undefined;
  const listStyleType =
    style === "ordered" ? orderedListStyle(indent) : unorderedListStyle(indent);
  // Upstream caps indent at 5 * 28 = 140px; beyond that it stays flat.
  const extraIndent = indent > 0 && indent <= 5 ? indent * 28 : 0;
  return (
    <div data-rich-text="list" data-style={style} className="flex gap-2">
      {border === 1 ? (
        <div
          aria-hidden
          className="w-1 shrink-0 self-stretch rounded bg-border"
        />
      ) : null}
      <Tag
        start={start}
        style={{
          listStyleType,
          paddingInlineStart: 24 + extraIndent,
          marginBlock: 0,
        }}
        className={cn("min-w-0")}
      >
        {elements.map((section, i) => (
          <li key={i}>
            {section.elements.map((el, j) => (
              <Fragment key={j}>
                <InlineElement element={el} />
              </Fragment>
            ))}
          </li>
        ))}
      </Tag>
    </div>
  );
}
