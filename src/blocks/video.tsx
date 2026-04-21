import { Play } from "lucide-react";
import { InlineLink } from "../composition/InlineLink";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";
import type { PlainTextObject } from "../types";

export interface VideoBlockData {
  type: "video";
  block_id?: string;
  video_url: string;
  thumbnail_url?: string;
  alt_text: string;
  title?: PlainTextObject;
  title_url?: string;
  author_name?: string;
  description?: PlainTextObject;
  provider_name?: string;
  provider_icon_url?: string;
}

export function VideoBlock({ block }: { block: VideoBlockData }) {
  const size = useSize();
  return (
    <figure data-block="video" className="overflow-hidden rounded-md border border-border">
      <div className="relative aspect-video w-full bg-muted">
        {block.thumbnail_url ? (
          <img
            src={block.thumbnail_url}
            alt={block.alt_text}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : null}
        <a
          href={block.video_url}
          target="_blank"
          rel="noreferrer"
          aria-label={`Play ${block.alt_text}`}
          className="absolute inset-0 flex items-center justify-center bg-black/20 text-white hover:bg-black/30"
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/60">
            <Play className="h-6 w-6" />
          </span>
        </a>
      </div>
      {(block.title || block.provider_name || block.author_name) ? (
        <figcaption
          className={cn(
            "flex flex-col gap-0.5 border-t border-border bg-muted/30 px-3 py-2",
            sizing[size].secondary,
          )}
        >
          {block.title ? (
            <span className="font-medium text-foreground">
              {block.title_url ? (
                <InlineLink href={block.title_url}>{block.title.text}</InlineLink>
              ) : (
                block.title.text
              )}
            </span>
          ) : null}
          {block.description ? (
            <span className="text-muted-foreground">
              {block.description.text}
            </span>
          ) : null}
          <span className="text-muted-foreground">
            {[block.provider_name, block.author_name]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </figcaption>
      ) : null}
    </figure>
  );
}
