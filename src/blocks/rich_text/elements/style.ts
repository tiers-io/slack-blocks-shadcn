import type { RichTextStyle } from "../types";

// Convert a rich-text style record to a className string. Mirrors
// upstream `rich_text_section.tsx:32-39` (bold/italic/strike/underline/code)
// plus the mention-specific `highlight` / `client_highlight` flags and
// the link-disabling `unlink`. Kept in one place so every inline
// element reaches for the same translation.

export function styleToClass(style: RichTextStyle | undefined): string {
  if (!style) return "";
  const parts: string[] = [];
  if (style.bold) parts.push("font-semibold");
  if (style.italic) parts.push("italic");
  if (style.strike) parts.push("line-through");
  if (style.underline) parts.push("underline");
  if (style.code) parts.push("rounded bg-muted px-1 font-mono text-[0.85em]");
  if (style.highlight) parts.push("bg-amber-400/30 text-amber-950 dark:text-amber-50 px-0.5");
  if (style.client_highlight) parts.push("bg-primary/20 text-primary px-0.5");
  return parts.join(" ");
}
