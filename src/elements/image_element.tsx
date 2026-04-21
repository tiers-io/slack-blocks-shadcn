import type { ImageElement } from "../types";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

// `type: "image"` element used inside context/section accessories etc.
// Different from the standalone `image` *block* (which is a figure).

export function ImageElementView({ element }: { element: ImageElement }) {
  const size = useSize();
  return (
    <img
      src={element.image_url}
      alt={element.alt_text}
      loading="lazy"
      className={cn(
        "inline-block shrink-0 rounded-sm object-cover",
        sizing[size].avatar,
      )}
    />
  );
}
