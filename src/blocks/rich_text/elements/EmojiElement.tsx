import { get as getEmoji } from "node-emoji";
import { useHooks } from "../../../context";
import type { RichTextEmoji } from "../types";

// Slack sends rich_text emoji elements in two shapes:
//   { name: "thumbsup" }                       — lookup by shortcode
//   { name: "couple_with_heart",
//     unicode: "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe" }
//       — compound sequence as dash-separated codepoints
// We need to turn either form into an actual renderable glyph.

function unicodeSequenceToString(seq: string): string {
  return seq
    .split("-")
    .map((code) => String.fromCodePoint(parseInt(code, 16)))
    .join("");
}

// Slack ships shortcodes that node-emoji doesn't know (thumbsup/down are
// the canonical Slack spellings; node-emoji expects +1/-1). Map the
// common divergences explicitly before falling back to node-emoji.
const SLACK_TO_NODE_EMOJI: Record<string, string> = {
  thumbsup: "+1",
  thumbs_up: "+1",
  thumbsdown: "-1",
  thumbs_down: "-1",
};

function resolveShortcode(name: string): string | undefined {
  const aliased = SLACK_TO_NODE_EMOJI[name];
  const candidates = [
    aliased,
    name,
    name.replace(/-/g, "_"),
    name.replace(/_/g, "-"),
  ].filter(Boolean) as string[];
  for (const c of candidates) {
    const hit = getEmoji(c);
    if (hit) return hit;
  }
  return undefined;
}

// Slack's skin_tone is 2-6 (2 = lightest). Fitzpatrick modifier codepoints
// are U+1F3FB..U+1F3FF, starting at skin-tone 2 ⇒ formula 0x1F3F9 + tone.
function skinToneModifier(tone?: number): string {
  if (tone === undefined || tone < 2 || tone > 6) return "";
  return String.fromCodePoint(0x1f3f9 + tone);
}

export function EmojiElement({ element }: { element: RichTextEmoji }) {
  const hooks = useHooks();
  const parse = (d: { name: string }) => {
    if (element.unicode && /^[0-9a-fA-F-]+$/.test(element.unicode)) {
      return unicodeSequenceToString(element.unicode);
    }
    const base = resolveShortcode(d.name);
    if (!base) return `:${d.name}:`;
    return base + skinToneModifier(element.skin_tone);
  };
  if (hooks.emoji) {
    return (
      <>
        {hooks.emoji(
          {
            name: element.name,
            unicode: element.unicode,
            skin_tone: element.skin_tone as 1 | 2 | 3 | 4 | 5 | 6 | undefined,
          },
          parse,
        )}
      </>
    );
  }
  return <>{parse({ name: element.name })}</>;
}
