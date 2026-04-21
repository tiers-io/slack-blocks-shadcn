import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";
import type { PlainTextObject } from "../types";

export interface HeaderBlockData {
  type: "header";
  block_id?: string;
  text: PlainTextObject;
}

export function HeaderBlock({ block }: { block: HeaderBlockData }) {
  const size = useSize();
  return (
    <h3
      data-block="header"
      className={cn(sizing[size].header, "text-foreground")}
    >
      {block.text.text}
    </h3>
  );
}
