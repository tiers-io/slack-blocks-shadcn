import { RenderTextObject } from "../composition/TextObject";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";
import type { ImageElement, TextObject } from "../types";

export type ContextElement = TextObject | ImageElement;

export interface ContextBlockData {
  type: "context";
  block_id?: string;
  elements: ContextElement[];
}

export function ContextBlock({ block }: { block: ContextBlockData }) {
  const size = useSize();
  return (
    <div
      data-block="context"
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-muted-foreground",
        sizing[size].secondary,
      )}
    >
      {block.elements.map((el, i) => {
        if ((el as ImageElement).type === "image") {
          const img = el as ImageElement;
          return (
            <img
              key={i}
              src={img.image_url}
              alt={img.alt_text}
              className={cn(
                "shrink-0 rounded-sm object-cover",
                sizing[size].avatar,
              )}
              loading="lazy"
            />
          );
        }
        return (
          <span key={i} className="break-words">
            <RenderTextObject text={el as TextObject} />
          </span>
        );
      })}
    </div>
  );
}
