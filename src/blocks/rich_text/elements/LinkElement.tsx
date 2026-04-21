import { useComponent } from "../../../components-registry";
import { cn } from "../../../utils/cn";
import { isDev } from "../../../utils/env";
import { styleToClass } from "./style";
import type { RichTextLink } from "../types";

export function LinkElement({ element }: { element: RichTextLink }) {
  const InlineLink = useComponent("InlineLink");
  if (element.unsafe && isDev()) {
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
