import { Card, CardContent, CardHeader, CardFooter, CardTitle } from "../ui/card";
import { RenderTextObject } from "../composition/TextObject";
import { ElementDispatch } from "../elements/dispatch";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import type { TextObject, ImageElement } from "../types";

type AnyElement = { type: string; [k: string]: unknown };

export interface CardBlockData {
  type: "card";
  block_id?: string;
  header?: { text?: TextObject; image?: ImageElement };
  body?: { text?: TextObject; image?: ImageElement; elements?: AnyElement[] };
  footer?: { elements?: AnyElement[]; text?: TextObject };
}

export function CardBlock({ block }: { block: CardBlockData }) {
  const size = useSize();
  const headerImg = block.header?.image;
  return (
    <Card data-block="card" className={cn(sizing[size].radius)}>
      {headerImg ? (
        <img
          src={headerImg.image_url}
          alt={headerImg.alt_text}
          className="block h-40 w-full object-cover"
          loading="lazy"
        />
      ) : null}
      {block.header?.text ? (
        <CardHeader>
          <CardTitle>
            <RenderTextObject text={block.header.text} />
          </CardTitle>
        </CardHeader>
      ) : null}
      {block.body ? (
        <CardContent className="flex flex-col gap-2">
          {block.body.image ? (
            <img
              src={block.body.image.image_url}
              alt={block.body.image.alt_text}
              className="rounded-md object-cover"
              loading="lazy"
            />
          ) : null}
          {block.body.text ? (
            <div className={cn("text-foreground/90", sizing[size].body)}>
              <RenderTextObject text={block.body.text} />
            </div>
          ) : null}
          {block.body.elements && block.body.elements.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {block.body.elements.map((el, i) => (
                <ElementDispatch key={i} element={el} />
              ))}
            </div>
          ) : null}
        </CardContent>
      ) : null}
      {block.footer && (block.footer.text || block.footer.elements?.length) ? (
        <CardFooter className="flex flex-wrap items-center gap-2">
          {block.footer.text ? (
            <div
              className={cn(
                "text-muted-foreground",
                sizing[size].secondary,
              )}
            >
              <RenderTextObject text={block.footer.text} />
            </div>
          ) : null}
          {block.footer.elements?.map((el, i) => (
            <ElementDispatch key={i} element={el} />
          ))}
        </CardFooter>
      ) : null}
    </Card>
  );
}
