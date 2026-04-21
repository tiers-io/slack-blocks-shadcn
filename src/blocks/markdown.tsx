import { renderMrkdwn } from "../mrkdwn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

export interface MarkdownBlockData {
  type: "markdown";
  block_id?: string;
  text: string;
}

export function MarkdownBlock({ block }: { block: MarkdownBlockData }) {
  const size = useSize();
  return (
    <div
      data-block="markdown"
      className={cn("whitespace-pre-wrap break-words", sizing[size].body)}
    >
      {renderMrkdwn(block.text)}
    </div>
  );
}
