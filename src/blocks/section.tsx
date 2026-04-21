import { RenderTextObject } from "../composition/TextObject";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";
import type { ImageElement, TextObject } from "../types";

// Section is the most common block. It carries one text and optionally a
// field grid + an accessory. Accessories that aren't images fall back to
// a small "Open in Slack" placeholder — full interactive elements come in
// Phase D.

export interface SectionBlockData {
  type: "section";
  block_id?: string;
  text?: TextObject;
  fields?: TextObject[];
  accessory?: (ImageElement | { type: string; [k: string]: unknown });
}

export function SectionBlock({ block }: { block: SectionBlockData }) {
  const size = useSize();
  const acc = block.accessory;
  const accessoryIsImage = acc?.type === "image";
  return (
    <div
      data-block="section"
      className={cn("flex items-start gap-3", sizing[size].body)}
    >
      <div className="min-w-0 flex-1 break-words">
        {block.text ? (
          <div>
            <RenderTextObject text={block.text} />
          </div>
        ) : null}
        {block.fields && block.fields.length > 0 ? (
          <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
            {block.fields.map((f, i) => (
              <div key={i} className="break-words">
                <RenderTextObject text={f} />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {accessoryIsImage ? (
        <img
          src={(acc as ImageElement).image_url}
          alt={(acc as ImageElement).alt_text ?? ""}
          className={cn(
            "shrink-0 rounded-md border border-border object-cover",
            size === "sm" ? "h-10 w-10" : size === "lg" ? "h-16 w-16" : "h-12 w-12",
          )}
          loading="lazy"
        />
      ) : null}
    </div>
  );
}
