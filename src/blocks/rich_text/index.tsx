import { sizing } from "../../sizing";
import { useSize } from "../../context";
import { cn } from "../../utils/cn";
import { RichTextSection } from "./section";
import { RichTextList } from "./list";
import { RichTextQuote } from "./quote";
import { RichTextPreformatted } from "./preformatted";
import type {
  RichTextBlockData,
  RichTextListElement,
  RichTextSubBlock,
} from "./types";

// Ported from upstream `rich_text.tsx:12-57`. A rich_text block's list
// children can span multiple indent levels and can be broken by non-list
// sub-blocks. For every list at indent N we emit the number starting
// from the tally of prior items at indent N, then bump the tally by
// this list's length. Breaking out of a list resets every indent's
// tally to zero; changing to a deeper indent resets all indents
// beyond the current one so the inner list restarts correctly.

export function RichTextBlock({ block }: { block: RichTextBlockData }) {
  const size = useSize();
  const map: Record<number, number> = {
    0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0,
  };
  return (
    <div
      data-block="rich_text"
      className={cn("text-foreground/90", sizing[size].body, sizing[size].gap)}
    >
      {block.elements.map((el, i) => {
        let consecutive = 0;
        if (el.type !== "rich_text_list") {
          for (let k = 0; k <= 8; k++) map[k] = 0;
        } else {
          const indent = (el as RichTextListElement).indent ?? 0;
          for (let k = indent + 1; k <= 8; k++) map[k] = 0;
          consecutive = map[indent] ?? 0;
          map[indent] = consecutive + el.elements.length;
        }
        return <SubBlock key={i} block={el} consecutive_index={consecutive} />;
      })}
    </div>
  );
}

function SubBlock({
  block,
  consecutive_index,
}: {
  block: RichTextSubBlock;
  consecutive_index: number;
}) {
  switch (block.type) {
    case "rich_text_section":
      return <RichTextSection block={block} />;
    case "rich_text_list":
      return <RichTextList block={block} consecutive_index={consecutive_index} />;
    case "rich_text_quote":
      return <RichTextQuote block={block} />;
    case "rich_text_preformatted":
      return <RichTextPreformatted block={block} />;
    default:
      return null;
  }
}

export type { RichTextBlockData } from "./types";
