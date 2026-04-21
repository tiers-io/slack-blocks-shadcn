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
import { isDev } from "./utils/env";
import {
  SectionBlock,
  DividerBlock,
  HeaderBlock,
  ContextBlock,
  ImageBlock,
  RichTextBlock,
  ActionsBlock,
  FileBlock,
  VideoBlock,
  MarkdownBlock,
  AlertBlock,
  InputBlock,
  ContextActionsBlock,
  CardBlock,
  CarouselBlock,
  PlanBlock,
  TaskCardBlock,
  TableBlock,
  type TableBlockData,
  type InputBlockData,
  type ContextActionsBlockData,
  type CardBlockData,
  type CarouselBlockData,
  type PlanBlockData,
  type TaskCardBlockData,
  type SectionBlockData,
  type HeaderBlockData,
  type ContextBlockData,
  type ImageBlockData,
  type RichTextBlockData,
  type ActionsBlockData,
  type FileBlockData,
  type VideoBlockData,
  type MarkdownBlockData,
  type AlertBlockData,
} from "./blocks";
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
  switch (type) {
    case "section":
      return <SectionBlock block={block as unknown as SectionBlockData} />;
    case "divider":
      return <DividerBlock />;
    case "header":
      return <HeaderBlock block={block as unknown as HeaderBlockData} />;
    case "context":
      return <ContextBlock block={block as unknown as ContextBlockData} />;
    case "image":
      return <ImageBlock block={block as unknown as ImageBlockData} />;
    case "rich_text":
      return <RichTextBlock block={block as unknown as RichTextBlockData} />;
    case "actions":
      return <ActionsBlock block={block as unknown as ActionsBlockData} />;
    case "file":
      return <FileBlock block={block as unknown as FileBlockData} />;
    case "video":
      return <VideoBlock block={block as unknown as VideoBlockData} />;
    case "markdown":
      return <MarkdownBlock block={block as unknown as MarkdownBlockData} />;
    case "alert":
      return <AlertBlock block={block as unknown as AlertBlockData} />;
    case "input":
      return <InputBlock block={block as unknown as InputBlockData} />;
    case "context_actions":
      return (
        <ContextActionsBlock
          block={block as unknown as ContextActionsBlockData}
        />
      );
    case "card":
      return <CardBlock block={block as unknown as CardBlockData} />;
    case "carousel":
      return <CarouselBlock block={block as unknown as CarouselBlockData} />;
    case "plan":
      return <PlanBlock block={block as unknown as PlanBlockData} />;
    case "task_card":
      return <TaskCardBlock block={block as unknown as TaskCardBlockData} />;
    case "table":
      return <TableBlock block={block as unknown as TableBlockData} />;
    default:
      if (isDev()) {
        // eslint-disable-next-line no-console
        console.warn(
          `[@tiers-io/slack-blocks-shadcn] unsupported block type: ${type}`,
        );
      }
      return null;
  }
}
