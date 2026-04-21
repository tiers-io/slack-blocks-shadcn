import { Separator } from "../ui/separator";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { cn } from "../utils/cn";

export function DividerBlock() {
  const size = useSize();
  return (
    <Separator
      data-block="divider"
      className={cn(sizing[size].dividerMargin, "bg-border/70")}
    />
  );
}
