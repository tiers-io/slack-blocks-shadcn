import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";
import type { RichTextStyle, RichTextText } from "../types";

// Render the text honouring the nested style record. Use semantic tags
// (`<b>`, `<i>`, `<s>`, `<u>`, `<code>`) matching Slack's real renderer
// so the output is A11y-friendly and survives copy/paste. Highlight
// flags pile extra classes onto the innermost wrapper.
//
// Nesting order (outermost first) matches upstream: code ▸ bold ▸
// italic ▸ strike ▸ underline. `highlight` / `client_highlight`
// attach as classes on the innermost wrapping <span>.

function renderStyled(
  style: RichTextStyle | undefined,
  content: ReactNode,
): ReactNode {
  if (!style) return content;
  let node: ReactNode = content;
  if (style.underline) node = <u>{node}</u>;
  if (style.strike) node = <s>{node}</s>;
  if (style.italic) node = <i>{node}</i>;
  if (style.bold) node = <b>{node}</b>;
  if (style.code) {
    node = (
      <code className="rounded bg-muted px-1 font-mono text-[0.85em]">
        {node}
      </code>
    );
  }
  const highlightCls = cn(
    style.highlight && "bg-amber-400/30 text-amber-950 dark:text-amber-50 px-0.5",
    style.client_highlight && "bg-primary/20 text-primary px-0.5",
  );
  if (highlightCls) {
    node = <span className={highlightCls}>{node}</span>;
  }
  return node;
}

export function TextElement({ element }: { element: RichTextText }) {
  return <>{renderStyled(element.style, element.text)}</>;
}
