import { cn } from "../../../utils/cn";
import { useHooks } from "../../../context";
import { styleToClass } from "./style";
import type { RichTextDate } from "../types";

// Date elements carry a Slack date-format token string (e.g. `{date_short}`),
// a timestamp (unix seconds as number or string), and an optional fallback
// label. Without a hook we render the fallback or an ISO string from the
// timestamp — callers who want Slack-style formatting pass `hooks.date`.

function defaultFormat(timestamp: number | string, fallback?: string): string {
  if (fallback) return fallback;
  const n = typeof timestamp === "number" ? timestamp : Number(timestamp);
  if (!Number.isFinite(n)) return String(timestamp);
  return new Date(n * 1000).toISOString();
}

export function DateElement({ element }: { element: RichTextDate }) {
  const hooks = useHooks();
  const fallback = defaultFormat(element.timestamp, element.fallback);
  const styleCls = styleToClass(element.style);
  const content = hooks.date
    ? hooks.date({
        timestamp: String(element.timestamp),
        format: element.format ?? "",
        link: element.url ?? null,
        fallback,
      })
    : fallback;
  if (!styleCls) return <>{content}</>;
  return <span className={cn(styleCls)}>{content}</span>;
}
