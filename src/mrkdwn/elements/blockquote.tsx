import type { BlockQuoteElement } from "../ast-types";
import { Paragraph } from "./paragraph";

export function Blockquote({ element }: { element: BlockQuoteElement }) {
  return (
    <blockquote className="border-l-2 border-border pl-3 text-muted-foreground">
      {element.children.map((para, i) => (
        <Paragraph key={i} element={para} isFirst={i === 0} />
      ))}
    </blockquote>
  );
}
