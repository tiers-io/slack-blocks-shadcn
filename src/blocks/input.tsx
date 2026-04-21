import { ElementDispatch } from "../elements/dispatch";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";
import type { PlainTextObject } from "../types";

// Input block = a labelled container wrapping a single element. Element
// is rendered read-only (same as in Phase D). Optional hint text below.

type AnyElement = { type: string; [k: string]: unknown };

export interface InputBlockData {
  type: "input";
  block_id?: string;
  label: PlainTextObject;
  element: AnyElement;
  hint?: PlainTextObject;
  optional?: boolean;
  dispatch_action?: boolean;
}

export function InputBlock({ block }: { block: InputBlockData }) {
  const size = useSize();
  return (
    <div
      data-block="input"
      className={cn("flex flex-col gap-1", sizing[size].body)}
    >
      <label className="flex items-center gap-1 font-medium text-foreground">
        {block.label.text}
        {block.optional ? (
          <span className={cn("text-muted-foreground", sizing[size].secondary)}>
            (optional)
          </span>
        ) : null}
      </label>
      <ElementDispatch element={block.element} />
      {block.hint ? (
        <p className={cn("text-muted-foreground", sizing[size].secondary)}>
          {block.hint.text}
        </p>
      ) : null}
    </div>
  );
}
