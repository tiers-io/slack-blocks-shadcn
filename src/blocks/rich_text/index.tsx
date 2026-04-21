import { sizing } from "../../sizing";
import { useSize } from "../../context";
import { cn } from "../../utils/cn";
import { RichTextSection } from "./section";
import { RichTextList } from "./list";
import { RichTextQuote } from "./quote";
import { RichTextPreformatted } from "./preformatted";
import type { RichTextBlockData, RichTextSubBlock } from "./types";

export function RichTextBlock({ block }: { block: RichTextBlockData }) {
  const size = useSize();
  return (
    <div
      data-block="rich_text"
      className={cn("text-foreground/90", sizing[size].body, sizing[size].gap)}
    >
      {block.elements.map((el, i) => (
        <SubBlock key={i} block={el} />
      ))}
    </div>
  );
}

function SubBlock({ block }: { block: RichTextSubBlock }) {
  switch (block.type) {
    case "rich_text_section":
      return <RichTextSection block={block} />;
    case "rich_text_list":
      return <RichTextList block={block} />;
    case "rich_text_quote":
      return <RichTextQuote block={block} />;
    case "rich_text_preformatted":
      return <RichTextPreformatted block={block} />;
    default:
      return null;
  }
}

export type { RichTextBlockData } from "./types";
