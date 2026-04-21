import type { RichTextInlineElement } from "../types";
import { TextElement } from "./TextElement";
import { LinkElement } from "./LinkElement";
import { EmojiElement } from "./EmojiElement";
import {
  UserElement,
  ChannelElement,
  UsergroupElement,
  BroadcastElement,
} from "./MentionElements";
import { DateElement } from "./DateElement";
import { ColorElement } from "./ColorElement";

// Single dispatch point for every inline element kind. Used by
// rich_text_section and rich_text_preformatted (the latter accepts only
// text + link, but sharing the dispatcher keeps the code path simple).

export function InlineElement({
  element,
}: {
  element: RichTextInlineElement;
}) {
  switch (element.type) {
    case "text":
      return <TextElement element={element} />;
    case "link":
      return <LinkElement element={element} />;
    case "emoji":
      return <EmojiElement element={element} />;
    case "user":
      return <UserElement element={element} />;
    case "channel":
      return <ChannelElement element={element} />;
    case "usergroup":
      return <UsergroupElement element={element} />;
    case "broadcast":
      return <BroadcastElement element={element} />;
    case "date":
      return <DateElement element={element} />;
    case "color":
      return <ColorElement element={element} />;
    default:
      return null;
  }
}

export {
  TextElement,
  LinkElement,
  EmojiElement,
  UserElement,
  ChannelElement,
  UsergroupElement,
  BroadcastElement,
  DateElement,
  ColorElement,
};
