import { get as getEmoji } from "node-emoji";
import { useHooks } from "../../context";
import type { SlackEmojiSubElement } from "../ast-types";

export function SlackEmoji({ element }: { element: SlackEmojiSubElement }) {
  const hooks = useHooks();
  const name = element.value;
  const parse = (d: { name: string }) => getEmoji(d.name) ?? `:${d.name}:`;
  if (hooks.emoji) {
    return <>{hooks.emoji({ name }, parse)}</>;
  }
  return <>{parse({ name })}</>;
}
