import { useState } from "react";
import { RenderTextObject } from "../composition/TextObject";
import { ElementDispatch } from "../elements/dispatch";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";
import type { ImageElement, TextObject } from "../types";

// Section is the most common block. One text + optional fields grid +
// optional accessory (image OR any interactive element). When `expand`
// is false, long text truncates to 3 lines with a local "show more"
// toggle — matches upstream `section.tsx` collapsed-default behaviour.

export interface SectionBlockData {
  type: "section";
  block_id?: string;
  text?: TextObject;
  fields?: TextObject[];
  accessory?: ImageElement | { type: string; [k: string]: unknown };
  /** When false (upstream default on long text), truncate to 3 lines. */
  expand?: boolean;
}

export function SectionBlock({ block }: { block: SectionBlockData }) {
  const size = useSize();
  const acc = block.accessory;
  const accessoryIsImage = acc?.type === "image";
  const canCollapse = block.expand === false;
  const [expanded, setExpanded] = useState(!canCollapse);
  return (
    <div
      data-block="section"
      className={cn("flex items-start gap-3", sizing[size].body)}
    >
      <div className="min-w-0 flex-1 break-words">
        {block.text ? (
          <>
            <div className={cn(!expanded && "line-clamp-3")}>
              <RenderTextObject text={block.text} />
            </div>
            {canCollapse ? (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className={cn(
                  "mt-1 text-primary hover:underline",
                  sizing[size].secondary,
                )}
              >
                {expanded ? "Show less" : "Show more"}
              </button>
            ) : null}
          </>
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
      ) : acc ? (
        <div className="shrink-0">
          <ElementDispatch element={acc as { type: string; [k: string]: unknown }} />
        </div>
      ) : null}
    </div>
  );
}
