import { get as getEmoji } from "node-emoji";
import { useHooks } from "../../../context";
import type { RichTextEmoji } from "../types";

export function EmojiElement({ element }: { element: RichTextEmoji }) {
  const hooks = useHooks();
  const parse = (d: { name: string }) =>
    element.unicode ?? getEmoji(d.name) ?? `:${d.name}:`;
  if (hooks.emoji) {
    return (
      <>
        {hooks.emoji(
          { name: element.name, unicode: element.unicode, skin_tone: element.skin_tone as 1 | 2 | 3 | 4 | 5 | 6 | undefined },
          parse,
        )}
      </>
    );
  }
  return <>{parse({ name: element.name })}</>;
}
