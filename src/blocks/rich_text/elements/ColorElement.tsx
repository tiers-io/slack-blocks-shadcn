import type { RichTextColor } from "../types";

// Slack's color element emits a small colour swatch followed by the hex.
// We match that — a bordered square plus the value, both inline.

export function ColorElement({ element }: { element: RichTextColor }) {
  return (
    <span className="inline-flex items-center gap-1 align-middle">
      <span
        aria-hidden
        className="inline-block h-3 w-3 rounded-sm border border-border"
        style={{ backgroundColor: element.value }}
      />
      <span className="font-mono text-[0.85em]">{element.value}</span>
    </span>
  );
}
