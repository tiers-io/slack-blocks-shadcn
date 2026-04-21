import { cn } from "../../utils/cn";
import { sizing } from "../../sizing";
import { useSize } from "../../context";
import { InlineElement } from "./elements";
import type { RichTextPreformattedElement } from "./types";

// Preformatted blocks are Slack's triple-backtick code fences. We render
// them as <pre> (not <pre><code>) to match the "raw text, no syntax
// highlighting" spirit. Inline elements inside a preformatted can only
// be `text` or `link` per the spec — both rendered verbatim by the
// element dispatcher, so no special-casing here.

export function RichTextPreformatted({
  block,
}: {
  block: RichTextPreformattedElement;
}) {
  const size = useSize();
  return (
    <pre
      data-rich-text="preformatted"
      className={cn(
        "overflow-x-auto rounded-md bg-muted px-3 py-2 whitespace-pre-wrap",
        sizing[size].code,
      )}
    >
      {block.elements.map((el, i) => (
        <InlineElement key={i} element={el} />
      ))}
    </pre>
  );
}
