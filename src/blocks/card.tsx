import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RenderTextObject } from "../composition/TextObject";
import { ElementDispatch } from "../elements/dispatch";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import type { TextObject, ImageElement } from "../types";

type AnyElement = { type: string; [k: string]: unknown };

// Shape ported from upstream:
//   title         (TextObject)     — header line
//   subtitle      (TextObject)     — smaller secondary line under title
//   body          (TextObject[])   — array of text lines
//   hero_image    (ImageElement)   — edge-to-edge hero at the top
//   icon          (ImageElement)   — small icon to the left of title
//   actions       (elements)       — inline action row in the footer
//   inCarousel    (boolean)        — when true, lets CarouselBlock know
//                                   to pick a tighter inner layout.

export interface CardBlockData {
  type: "card";
  block_id?: string;
  title?: TextObject;
  subtitle?: TextObject;
  body?: TextObject[];
  hero_image?: ImageElement;
  icon?: ImageElement;
  actions?: AnyElement[];
  inCarousel?: boolean;
}

export function CardBlock({ block }: { block: CardBlockData }) {
  const size = useSize();
  return (
    <Card
      data-block="card"
      data-in-carousel={block.inCarousel || undefined}
      className={cn(sizing[size].radius)}
    >
      {block.hero_image ? (
        <img
          src={block.hero_image.image_url}
          alt={block.hero_image.alt_text}
          className="block h-40 w-full object-cover"
          loading="lazy"
        />
      ) : null}
      {(block.title || block.subtitle || block.icon) ? (
        <CardHeader>
          <div className="flex items-center gap-2">
            {block.icon ? (
              <img
                src={block.icon.image_url}
                alt={block.icon.alt_text}
                className={cn("shrink-0 rounded-sm", sizing[size].avatar)}
                loading="lazy"
              />
            ) : null}
            <div className="min-w-0 flex-1">
              {block.title ? (
                <CardTitle>
                  <RenderTextObject text={block.title} />
                </CardTitle>
              ) : null}
              {block.subtitle ? (
                <div className={cn("text-muted-foreground", sizing[size].secondary)}>
                  <RenderTextObject text={block.subtitle} />
                </div>
              ) : null}
            </div>
          </div>
        </CardHeader>
      ) : null}
      {block.body && block.body.length > 0 ? (
        <CardContent className={cn("flex flex-col gap-1", sizing[size].body)}>
          {block.body.map((t, i) => (
            <div key={i} className="text-foreground/90">
              <RenderTextObject text={t} />
            </div>
          ))}
        </CardContent>
      ) : null}
      {block.actions && block.actions.length > 0 ? (
        <CardFooter className="flex flex-wrap items-center gap-2">
          {block.actions.map((a, i) => (
            <ElementDispatch key={i} element={a} />
          ))}
        </CardFooter>
      ) : null}
    </Card>
  );
}
