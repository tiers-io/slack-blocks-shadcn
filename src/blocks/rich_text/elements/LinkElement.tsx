import { InlineLink } from "../../../composition/InlineLink";
import { cn } from "../../../utils/cn";
import { styleToClass } from "./style";
import type { RichTextLink } from "../types";

export function LinkElement({ element }: { element: RichTextLink }) {
  const label = element.text ?? element.url;
  const cls = styleToClass(element.style);
  if (element.style?.unlink) {
    return cls ? <span className={cn(cls)}>{label}</span> : <>{label}</>;
  }
  return (
    <InlineLink href={element.url} className={cls || undefined}>
      {label}
    </InlineLink>
  );
}
