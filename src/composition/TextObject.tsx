import { get as getEmoji } from "node-emoji";
import type { TextObject } from "../types";
import { renderMrkdwn } from "../mrkdwn";

// Render a Slack text object. plain_text passes through as a string,
// mrkdwn goes through the full parser (links, mentions, inline emphasis,
// code, emoji, code fences). `verbatim: true` on mrkdwn skips parsing
// and prints the raw text — Slack uses this when the payload contains
// literal tokens that mustn't be interpreted.

export interface TextObjectProps {
  text: TextObject | undefined;
}

function resolveEmojiShortcodes(raw: string): string {
  // Slack only converts `:name:` shortcodes when the text object has
  // `emoji: true`. Usage: Header / Button labels that carry emojis.
  return raw.replace(/:([a-z0-9_+\-']+):/gi, (match, name) => {
    const resolved = getEmoji(name);
    return resolved ?? match;
  });
}

export function RenderTextObject({ text }: TextObjectProps) {
  if (!text) return null;
  if (text.type === "plain_text") {
    const value = text.emoji === false ? text.text : resolveEmojiShortcodes(text.text);
    return <>{value}</>;
  }
  if (text.verbatim) return <>{text.text}</>;
  return <>{renderMrkdwn(text.text)}</>;
}
