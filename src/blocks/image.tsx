import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";
import type { PlainTextObject } from "../types";

export interface ImageBlockData {
  type: "image";
  block_id?: string;
  image_url: string;
  alt_text: string;
  title?: PlainTextObject;
}

export function ImageBlock({ block }: { block: ImageBlockData }) {
  const size = useSize();
  return (
    <figure
      data-block="image"
      className={cn(
        "overflow-hidden border border-border",
        sizing[size].radius,
      )}
    >
      <img
        src={block.image_url}
        alt={block.alt_text}
        className="block max-h-96 w-auto max-w-full"
        loading="lazy"
      />
      {block.title ? (
        <figcaption
          className={cn(
            "border-t border-border bg-muted/30 px-3 py-1.5 text-muted-foreground",
            sizing[size].secondary,
          )}
        >
          {block.title.text}
        </figcaption>
      ) : null}
    </figure>
  );
}
