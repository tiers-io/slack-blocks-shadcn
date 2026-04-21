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
  /** Native image width (px). Upstream exposes it; used to reserve layout slot. */
  image_width?: number;
  /** Native image height (px). */
  image_height?: number;
  /** File size in bytes. */
  image_bytes?: number;
  /** Surfaced as `data-animated` so consumers can add a pause control. */
  is_animated?: boolean;
}

export function ImageBlock({ block }: { block: ImageBlockData }) {
  const size = useSize();
  return (
    <figure
      data-block="image"
      data-animated={block.is_animated || undefined}
      className={cn(
        "overflow-hidden border border-border",
        sizing[size].radius,
      )}
    >
      <img
        src={block.image_url}
        alt={block.alt_text}
        width={block.image_width}
        height={block.image_height}
        data-bytes={block.image_bytes}
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
