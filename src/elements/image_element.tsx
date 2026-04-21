import type { ImageElement } from "../types";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

// `type: "image"` element used inside context/section accessories etc.
// Different from the standalone `image` *block* (which is a figure).
// `inside` upstream controls the wrapper — small + tight spacing inside
// context rows, larger + rounded inside section accessories.

export function ImageElementView({
  element,
  inside = "section",
}: {
  element: ImageElement;
  inside?: "context" | "section";
}) {
  const size = useSize();
  if (inside === "context") {
    return (
      <img
        src={element.image_url}
        alt={element.alt_text}
        loading="lazy"
        className={cn(
          "mr-1 mb-[5px] inline-block shrink-0 rounded-sm object-cover",
          sizing[size].avatar,
        )}
      />
    );
  }
  return (
    <img
      src={element.image_url}
      alt={element.alt_text}
      loading="lazy"
      className={cn(
        "inline-block shrink-0 rounded-lg object-cover",
        size === "sm" ? "h-14 w-14" : size === "lg" ? "h-24 w-24" : "h-20 w-20",
      )}
    />
  );
}
