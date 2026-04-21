import type { BlockSize } from "./types";

// Centralized size scales. One row per size, one column per visual axis.
// Block components look up `sizing[size][axis]` to get their class string.
// Keeping this as a lookup (not CVA) because CVA shines for combinatorial
// variants; here we only vary along `size`.

export interface SizeScale {
  /** Body text (paragraphs, section bodies, mrkdwn). */
  body: string;
  /** Secondary / metadata text (context rows, captions, footers). */
  secondary: string;
  /** Block headings (`header`, card titles). */
  header: string;
  /** Monospace / code. */
  code: string;
  /** Inline-code token. */
  codeInline: string;
  /** Container padding for Card-like block envelopes. */
  padding: string;
  /** Inner gap / `space-y` between siblings. */
  gap: string;
  /** Stack spacing between blocks. */
  stack: string;
  /** Lucide icon dimensions. */
  icon: string;
  /** Inline image / avatar (used in context rows, accessories). */
  avatar: string;
  /** Border radius for Card-like surfaces. */
  radius: string;
  /** Divider vertical margin. */
  dividerMargin: string;
}

export const sizing: Record<BlockSize, SizeScale> = {
  sm: {
    body: "text-xs leading-normal",
    secondary: "text-[11px] leading-tight",
    header: "text-sm font-semibold leading-tight",
    code: "font-mono text-[11px] leading-snug",
    codeInline: "rounded bg-muted px-1 font-mono text-[0.85em]",
    padding: "p-2",
    gap: "space-y-1.5",
    stack: "space-y-1.5",
    icon: "h-3 w-3",
    avatar: "h-4 w-4",
    radius: "rounded-md",
    dividerMargin: "my-1",
  },
  default: {
    body: "text-sm leading-normal",
    secondary: "text-xs leading-tight",
    header: "text-base font-semibold leading-tight",
    code: "font-mono text-xs leading-snug",
    codeInline: "rounded bg-muted px-1 font-mono text-[0.85em]",
    padding: "p-3",
    gap: "space-y-2",
    stack: "space-y-2",
    icon: "h-4 w-4",
    avatar: "h-5 w-5",
    radius: "rounded-md",
    dividerMargin: "my-2",
  },
  lg: {
    body: "text-base leading-relaxed",
    secondary: "text-sm leading-tight",
    header: "text-lg font-semibold leading-tight",
    code: "font-mono text-sm leading-snug",
    codeInline: "rounded bg-muted px-1.5 font-mono text-[0.9em]",
    padding: "p-4",
    gap: "space-y-3",
    stack: "space-y-3",
    icon: "h-5 w-5",
    avatar: "h-6 w-6",
    radius: "rounded-lg",
    dividerMargin: "my-3",
  },
};

export function sized(size: BlockSize, axis: keyof SizeScale): string {
  return sizing[size][axis];
}
