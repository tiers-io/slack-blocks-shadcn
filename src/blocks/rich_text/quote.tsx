import { InlineElement } from "./elements";
import type { RichTextQuoteElement } from "./types";

export function RichTextQuote({ block }: { block: RichTextQuoteElement }) {
  return (
    <blockquote
      data-rich-text="quote"
      className="border-l-2 border-border pl-3 text-muted-foreground whitespace-pre-wrap"
    >
      {block.elements.map((el, i) => (
        <InlineElement key={i} element={el} />
      ))}
    </blockquote>
  );
}
