import type { ReactNode } from "react";
import { useMemo } from "react";
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
  ComponentsContext,
  DEFAULT_COMPONENTS,
  OnActionProvider,
  useComponent,
  type ComponentOverrides,
  type OnActionCallback,
} from "./components-registry";
import type { Block, BlockSize } from "./types";

// Root render. Threads size + hooks + data + components + onAction
// through context, then iterates the blocks array. Block dispatch is a
// type-keyed lookup against the registry — every block is swappable
// from the call site.

export interface MessageProps {
  blocks: Block[];
  size?: BlockSize;
  theme?: "light" | "dark";
  hooks?: Hooks;
  data?: Data;
  /** Override any default block/element/composition renderer. */
  components?: Partial<ComponentOverrides>;
  /** Single callback fired by every interactive element. */
  onAction?: OnActionCallback;
  /** Kept for parity; always true today (we never render Slack chrome). */
  withoutWrapper?: boolean;
  className?: string;
}

const BLOCK_KEY: Record<string, keyof ComponentOverrides> = {
  section: "SectionBlock",
  divider: "DividerBlock",
  header: "HeaderBlock",
  context: "ContextBlock",
  image: "ImageBlock",
  rich_text: "RichTextBlock",
  actions: "ActionsBlock",
  context_actions: "ContextActionsBlock",
  file: "FileBlock",
  video: "VideoBlock",
  markdown: "MarkdownBlock",
  alert: "AlertBlock",
  input: "InputBlock",
  card: "CardBlock",
  carousel: "CarouselBlock",
  plan: "PlanBlock",
  task_card: "TaskCardBlock",
  table: "TableBlock",
};

export function Message({
  blocks,
  size = "default",
  hooks = {},
  data = {},
  components,
  onAction,
  className,
}: MessageProps) {
  const merged = useMemo<ComponentOverrides>(
    () => (components ? { ...DEFAULT_COMPONENTS, ...components } : DEFAULT_COMPONENTS),
    [components],
  );
  if (!blocks || blocks.length === 0) return null;
  return (
    <SizeContext.Provider value={size}>
      <HooksContext.Provider value={hooks}>
        <DataContext.Provider value={data}>
          <ComponentsContext.Provider value={merged}>
            <OnActionProvider value={onAction}>
              <div
                data-slot="slack-blocks"
                data-size={size}
                className={cn(sizing[size].stack, className)}
              >
                {blocks.map((block, i) => (
                  <BlockDispatch key={i} block={block} />
                ))}
              </div>
            </OnActionProvider>
          </ComponentsContext.Provider>
        </DataContext.Provider>
      </HooksContext.Provider>
    </SizeContext.Provider>
  );
}

function BlockDispatch({ block }: { block: Block }): ReactNode {
  const type = block?.type;
  const key = BLOCK_KEY[type as keyof typeof BLOCK_KEY];
  const Component = useComponent(
    key ?? ("SectionBlock" as keyof ComponentOverrides),
  );
  if (!key) {
    if (isDev()) {
      // eslint-disable-next-line no-console
      console.warn(
        `[@tiers-io/slack-blocks-shadcn] unsupported block type: ${type}`,
      );
    }
    return null;
  }
  // The registry entries accept either `{ block }` or nothing (Divider).
  // We cast the narrow union away — the runtime payload matches because
  // our block-type → component-key map is exhaustive.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const C = Component as any;
  return key === "DividerBlock" ? <C /> : <C block={block} />;
}
