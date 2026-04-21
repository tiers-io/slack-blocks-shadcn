import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { CardBlock, type CardBlockData } from "./card";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { useCallback, useRef } from "react";

export interface CarouselBlockData {
  type: "carousel";
  block_id?: string;
  items: CardBlockData[];
}

// Carousel = horizontal scrollable row of cards. At sm we drop the arrow
// buttons to save space; at default/lg they scroll the container.

export function CarouselBlock({ block }: { block: CarouselBlockData }) {
  const size = useSize();
  const ref = useRef<HTMLDivElement>(null);
  const nudge = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  }, []);
  const showArrows = size !== "sm";
  return (
    <div data-block="carousel" className="relative">
      <div
        ref={ref}
        data-carousel-track
        className={cn(
          "flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth",
          sizing[size].padding,
        )}
      >
        {block.items.map((item, i) => (
          <div
            key={i}
            className="w-[min(24rem,100%)] shrink-0 snap-start"
          >
            <CardBlock block={item} />
          </div>
        ))}
      </div>
      {showArrows ? (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => nudge(-1)}
            aria-label="Scroll left"
            className="absolute left-1 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => nudge(1)}
            aria-label="Scroll right"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur"
          >
            <ChevronRight />
          </Button>
        </>
      ) : null}
    </div>
  );
}
