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

export function RenderTextObject({ text }: TextObjectProps) {
  if (!text) return null;
  if (text.type === "plain_text") return <>{text.text}</>;
  if (text.verbatim) return <>{text.text}</>;
  return <>{renderMrkdwn(text.text)}</>;
}
