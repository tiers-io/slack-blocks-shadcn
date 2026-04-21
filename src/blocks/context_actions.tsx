import { ElementDispatch } from "../elements/dispatch";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

type AnyElement = { type: string; [k: string]: unknown };

export interface ContextActionsBlockData {
  type: "context_actions";
  block_id?: string;
  elements: AnyElement[];
}

// Like `context` but horizontal actions. Visually a compact toolbar row
// below a message — tighter than the full `actions` block.

export function ContextActionsBlock({
  block,
}: {
  block: ContextActionsBlockData;
}) {
  const size = useSize();
  return (
    <div
      data-block="context_actions"
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-muted-foreground",
        sizing[size].secondary,
      )}
    >
      {block.elements.map((el, i) => (
        <ElementDispatch key={i} element={el} />
      ))}
    </div>
  );
}
