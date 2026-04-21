import { InlineLink } from "../../../composition/InlineLink";
import { cn } from "../../../utils/cn";
import { styleToClass } from "./style";
import type { RichTextLink } from "../types";

export function LinkElement({ element }: { element: RichTextLink }) {
  if (element.unsafe && typeof console !== "undefined" && import.meta?.env?.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      "[@tiers-io/slack-blocks-shadcn] rendering unsafe link:",
      element.url,
    );
  }
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
