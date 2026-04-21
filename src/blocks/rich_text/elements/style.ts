import type { RichTextStyle } from "../types";

// Convert a rich-text style record to a className string. Kept in one
// place so every inline element uses the same scheme.

export function styleToClass(style: RichTextStyle | undefined): string {
  if (!style) return "";
  const parts: string[] = [];
  if (style.bold) parts.push("font-semibold");
  if (style.italic) parts.push("italic");
  if (style.strike) parts.push("line-through");
  if (style.code) parts.push("rounded bg-muted px-1 font-mono text-[0.85em]");
  return parts.join(" ");
}
