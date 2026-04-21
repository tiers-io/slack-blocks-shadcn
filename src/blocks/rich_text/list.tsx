import { Fragment } from "react";
import { cn } from "../../utils/cn";
import { numberToAlpha, numberToRoman } from "../../utils/numbers";
import { InlineElement } from "./elements";
import type { RichTextListElement } from "./types";

// Ported from upstream `rich_text.tsx` lines 67-127 +
// `rich_text_list_wrapper.tsx`. The ordered/unordered decision, the
// per-indent marker style, and the `offset`/`border` handling are 1:1.
// The `consecutive_index` argument is the running count of prior
// items at the same indent level — the parent RichTextBlock dispatcher
// tracks it so that lists broken by a non-list element start over but
// lists continued across the same indent accumulate.

interface Props {
  block: RichTextListElement;
  /** Running tally of prior list items at this indent level. */
  consecutive_index: number;
}

function OrderedMarker({
  style,
  indent,
  index,
}: {
  style: "bullet" | "ordered";
  indent: number;
  index: number;
}) {
  if (style !== "ordered") return null;
  const one = index + 1;
  // indent 0/3/6 → decimal; 1/4/7 → alpha; 2/5/8 → Roman.
  const label =
    indent === 1 || indent === 4 || indent === 7
      ? `${numberToAlpha(one)}.`
      : indent === 2 || indent === 5 || indent === 8
        ? `${numberToRoman(one)}.`
        : `${one}.`;
  return (
    <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
      {label}
    </span>
  );
}

function BulletMarker({ indent }: { indent: number }) {
  // indent 0/3/6 → solid disc; 1/4/7 → ring; 2/5/8 → small square.
  const shape =
    indent === 1 || indent === 4 || indent === 7
      ? "h-1.5 w-1.5 rounded-full border border-current"
      : indent === 2 || indent === 5 || indent === 8
        ? "h-1.5 w-1.5 rounded-[1.5px] bg-current"
        : "h-1.5 w-1.5 rounded-full bg-current";
  return (
    <span className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center">
      <span className={shape} />
    </span>
  );
}

export function RichTextList({ block, consecutive_index }: Props) {
  const { elements, style, border = 0, indent = 0, offset = 0 } = block;
  const effectiveStart = style === "ordered" ? offset : 0;
  const Tag = style === "ordered" ? "ol" : "ul";
  return (
    <div
      data-rich-text="list"
      data-style={style}
      className="flex gap-2"
    >
      {border === 1 ? (
        <div
          aria-hidden
          className="w-1 shrink-0 self-stretch rounded bg-border"
        />
      ) : null}
      <Tag
        start={
          style === "ordered" && offset
            ? effectiveStart + 1
            : undefined
        }
        className={cn("list-none")}
      >
        {elements.map((section, i) => {
          const itemIndex = consecutive_index + effectiveStart + i;
          return (
            <li
              key={i}
              className="flex"
              style={{
                // upstream caps indent at 5 * 28 = 140px and goes to 0 beyond
                marginLeft: indent ? (indent > 5 ? 0 : indent * 28) : 0,
              }}
            >
              {style === "ordered" ? (
                <OrderedMarker style={style} indent={indent} index={itemIndex} />
              ) : (
                <BulletMarker indent={indent} />
              )}
              <div style={{ marginLeft: 6 }}>
                {section.elements.map((el, j) => (
                  <Fragment key={j}>
                    <InlineElement element={el} />
                  </Fragment>
                ))}
              </div>
            </li>
          );
        })}
      </Tag>
    </div>
  );
}
