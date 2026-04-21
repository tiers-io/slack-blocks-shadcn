import type { TextObject } from "../types";
import { renderMrkdwn } from "../mrkdwn";

// Render a Slack text object. plain_text passes through as a string,
// mrkdwn goes through the full parser (links, mentions, inline emphasis,
// code, emoji, code fences). Returns `null` for a missing text object
// so callers can `{text && <TextObject .../>}` without a guard.

export interface TextObjectProps {
  text: TextObject | undefined;
}

export function RenderTextObject({ text }: TextObjectProps) {
  if (!text) return null;
  if (text.type === "plain_text") return <>{text.text}</>;
  return <>{renderMrkdwn(text.text)}</>;
}
