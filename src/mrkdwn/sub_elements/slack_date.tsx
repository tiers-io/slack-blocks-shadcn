import { useHooks } from "../../context";
import type { SlackDateSubElement } from "../ast-types";

function defaultFormat(timestamp: string, fallback: string): string {
  if (fallback) return fallback;
  const n = Number(timestamp);
  if (!Number.isFinite(n)) return timestamp;
  return new Date(n * 1000).toISOString();
}

export function SlackDate({ element }: { element: SlackDateSubElement }) {
  const hooks = useHooks();
  const v = element.value;
  const fallback = defaultFormat(v.timestamp, v.fallbackText);
  if (hooks.date) {
    return (
      <>
        {hooks.date({
          timestamp: v.timestamp,
          format: v.tokenString,
          link: v.optionalLink || null,
          fallback,
        })}
      </>
    );
  }
  return <>{fallback}</>;
}
