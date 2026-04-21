import type { ReactNode } from "react";
import { cn } from "./utils/cn";
import {
  SizeContext,
  HooksContext,
  DataContext,
  type Hooks,
  type Data,
} from "./context";
import { sizing } from "./sizing";
import type { Block, BlockSize } from "./types";

// Root render. Threads size/hooks/data through context, then iterates
// the blocks array. Block dispatch is a thin switch populated phase-by-
// phase; unknown types fall through with a dev warning and render
// nothing.

export interface MessageProps {
  blocks: Block[];
  size?: BlockSize;
  theme?: "light" | "dark";
  hooks?: Hooks;
  data?: Data;
  /** Kept for parity; always true today (we never render Slack chrome). */
  withoutWrapper?: boolean;
  className?: string;
}

export function Message({
  blocks,
  size = "default",
  hooks = {},
  data = {},
  className,
}: MessageProps) {
  if (!blocks || blocks.length === 0) return null;
  return (
    <SizeContext.Provider value={size}>
      <HooksContext.Provider value={hooks}>
        <DataContext.Provider value={data}>
          <div
            data-slot="slack-blocks"
            data-size={size}
            className={cn(sizing[size].stack, className)}
          >
            {blocks.map((block, i) => (
              <BlockDispatch key={i} block={block} />
            ))}
          </div>
        </DataContext.Provider>
      </HooksContext.Provider>
    </SizeContext.Provider>
  );
}

function BlockDispatch({ block }: { block: Block }): ReactNode {
  const type = block?.type;
  // Phase B+ populate real renderers per-type. Today the dispatch is a
  // no-op for everything — the scaffold exists only so blocks wired up
  // later plug in here instead of growing a new switch.
  switch (type) {
    default:
      if (import.meta.env?.DEV) {
        // eslint-disable-next-line no-console
        console.warn(
          `[@tiers-io/slack-blocks-shadcn] unsupported block type: ${type}`,
        );
      }
      return null;
  }
}
