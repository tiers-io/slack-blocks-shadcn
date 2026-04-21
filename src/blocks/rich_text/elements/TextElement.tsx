import { cn } from "../../../utils/cn";
import { styleToClass } from "./style";
import type { RichTextText } from "../types";

export function TextElement({ element }: { element: RichTextText }) {
  const cls = styleToClass(element.style);
  if (!cls) return <>{element.text}</>;
  return <span className={cn(cls)}>{element.text}</span>;
}
