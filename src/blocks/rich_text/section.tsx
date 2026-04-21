import { InlineElement } from "./elements";
import type { RichTextSectionElement } from "./types";

export function RichTextSection({
  block,
}: {
  block: RichTextSectionElement;
}) {
  return (
    <p data-rich-text="section" className="whitespace-pre-wrap break-words">
      {block.elements.map((el, i) => (
        <InlineElement key={i} element={el} />
      ))}
    </p>
  );
}
