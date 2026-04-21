import { InlineElement } from "./elements";
import type { RichTextQuoteElement } from "./types";

// Ported from upstream `rich_text.tsx:154-170`. When `border === 1`,
// render an explicit left bar (matches upstream's visual). Otherwise
// use a border-left on the paragraph itself — keeps DOM flat.

export function RichTextQuote({ block }: { block: RichTextQuoteElement }) {
  const { border = 0, elements } = block;
  return (
    <blockquote data-rich-text="quote" className="flex gap-2">
      {border === 1 ? (
        <span
          aria-hidden
          className="w-1 shrink-0 self-stretch rounded bg-border"
        />
      ) : (
        <span
          aria-hidden
          className="w-px shrink-0 self-stretch bg-border"
        />
      )}
      <p className="text-muted-foreground whitespace-pre-wrap">
        {elements.map((el, i) => (
          <InlineElement key={i} element={el} />
        ))}
      </p>
    </blockquote>
  );
}
