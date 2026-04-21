import { cn } from "../../utils/cn";
import { sizing } from "../../sizing";
import { useSize } from "../../context";
import { InlineElement } from "./elements";
import type { RichTextPreformattedElement } from "./types";

// Ported from upstream `rich_text.tsx:131-152`. Wraps the <pre> in a
// <code> for semantics + renders the optional left border + surfaces
// `language` on the <pre> as a data attribute so downstream highlighting
// can hook in later (upstream doesn't syntax-highlight either).

export function RichTextPreformatted({
  block,
}: {
  block: RichTextPreformattedElement;
}) {
  const size = useSize();
  const { border = 0, language, elements } = block;
  return (
    <code
      data-rich-text="preformatted"
      className="flex w-full gap-2"
    >
      {border === 1 ? (
        <span
          aria-hidden
          className="w-1 shrink-0 self-stretch rounded bg-border"
        />
      ) : null}
      <pre
        data-language={language}
        className={cn(
          "grow overflow-x-auto whitespace-pre-wrap break-all rounded-md bg-muted px-3 py-2",
          sizing[size].code,
        )}
      >
        {elements.map((el, i) => (
          <InlineElement key={i} element={el} />
        ))}
      </pre>
    </code>
  );
}
