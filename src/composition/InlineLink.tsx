import type { ReactNode } from "react";
import { cn } from "../utils/cn";
import { useHooks } from "../context";

// Single link renderer used everywhere an `<a>` would appear. Consumers
// can replace the host element via `hooks.link` (e.g. to route internally
// through tanstack-router instead of navigating the shell).

export interface InlineLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: "_blank" | "_self" | "_parent" | "_top";
  rel?: string;
}

const BASE =
  "text-primary underline-offset-2 hover:underline focus-visible:underline break-words";

export function InlineLink({
  href,
  children,
  className,
  target = "_blank",
  rel = "noreferrer",
}: InlineLinkProps) {
  const { link } = useHooks();
  const merged = cn(BASE, className);
  if (link) {
    return <>{link({ href, children, className: merged, target, rel })}</>;
  }
  return (
    <a href={href} target={target} rel={rel} className={merged}>
      {children}
    </a>
  );
}
