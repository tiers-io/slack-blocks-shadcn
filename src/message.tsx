import type { Block, BlockSize } from "./types";

// Root entry. Scaffold only — renders nothing. Phase A.2 adds the context
// providers + dispatch; later phases populate per-block rendering.

export interface MessageProps {
  blocks: Block[];
  size?: BlockSize;
  theme?: "light" | "dark";
  /** Kept for parity with upstream. Currently always on in scaffold. */
  withoutWrapper?: boolean;
}

export function Message(_props: MessageProps) {
  return null;
}
