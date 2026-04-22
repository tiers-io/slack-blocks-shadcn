import { useHooks } from "../../context";
import type { SlackDateSubElement } from "../ast-types";

// Slack's `<!date^TS^TOKENS^LINK|FALLBACK>` syntax formats a unix timestamp
// using a handful of token placeholders. We render a close-enough
// approximation using the viewer's locale. The documented tokens we
// handle are a superset of what appears in the Block Kit Builder
// templates — anything else falls back to the fallback text.

const monthsLong = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const weekdaysLong = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

function ordinal(n: number): string {
  const rem10 = n % 10;
  const rem100 = n % 100;
  if (rem10 === 1 && rem100 !== 11) return `${n}st`;
  if (rem10 === 2 && rem100 !== 12) return `${n}nd`;
  if (rem10 === 3 && rem100 !== 13) return `${n}rd`;
  return `${n}th`;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

function to12Hour(h: number): { h: number; suffix: "AM" | "PM" } {
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return { h: hh, suffix };
}

function formatSlackDate(timestamp: string, tokens: string): string | null {
  const n = Number(timestamp);
  if (!Number.isFinite(n)) return null;
  const d = new Date(n * 1000);
  if (Number.isNaN(d.getTime())) return null;
  const yyyy = d.getFullYear();
  const m = d.getMonth();
  const day = d.getDate();
  const weekday = d.getDay();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  const { h: h12, suffix } = to12Hour(hours);

  const subs: Record<string, string> = {
    "{date_num}": `${yyyy}-${pad(m + 1)}-${pad(day)}`,
    "{date_slash}": `${pad(m + 1)}/${pad(day)}/${yyyy}`,
    "{date_long}": `${weekdaysLong[weekday]}, ${monthsLong[m]} ${ordinal(day)}, ${yyyy}`,
    "{date_long_pretty}": `${weekdaysLong[weekday]}, ${monthsLong[m]} ${ordinal(day)}, ${yyyy}`,
    "{date}": `${monthsLong[m]} ${ordinal(day)}, ${yyyy}`,
    "{date_pretty}": `${monthsLong[m]} ${ordinal(day)}, ${yyyy}`,
    "{date_short}": `${monthsShort[m]} ${day}, ${yyyy}`,
    "{date_short_pretty}": `${monthsShort[m]} ${day}, ${yyyy}`,
    "{time}": `${h12}:${pad(minutes)} ${suffix}`,
    "{time_secs}": `${h12}:${pad(minutes)}:${pad(seconds)} ${suffix}`,
  };

  let out = tokens;
  for (const [k, v] of Object.entries(subs)) {
    out = out.split(k).join(v);
  }
  return out;
}

function defaultFormat(
  timestamp: string,
  tokens: string,
  fallback: string,
): string {
  const formatted = tokens ? formatSlackDate(timestamp, tokens) : null;
  if (formatted) return formatted;
  if (fallback) return fallback;
  const n = Number(timestamp);
  if (!Number.isFinite(n)) return timestamp;
  return new Date(n * 1000).toISOString();
}

export function SlackDate({ element }: { element: SlackDateSubElement }) {
  const hooks = useHooks();
  const v = element.value;
  const rendered = defaultFormat(v.timestamp, v.tokenString, v.fallbackText);
  if (hooks.date) {
    return (
      <>
        {hooks.date({
          timestamp: v.timestamp,
          format: v.tokenString,
          link: v.optionalLink || null,
          fallback: rendered,
        })}
      </>
    );
  }
  if (v.optionalLink) {
    return (
      <a href={v.optionalLink} target="_blank" rel="noreferrer">
        {rendered}
      </a>
    );
  }
  return <>{rendered}</>;
}
