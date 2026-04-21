import type { ReactNode } from "react";
import YozoraParser from "@yozora/parser";
import { Blockquote, Code, Paragraph } from "./elements";
import {
  SlackBroadcastTokenizer,
  SlackChannelMentionTokenizer,
  SlackDateTokenizer,
  SlackEmojiTokenizer,
  SlackUserGroupMentionTokenizer,
  SlackUserMentionTokenizer,
} from "./tokenizers";
import type { MarkdownElement } from "./ast-types";

// Ported from upstream `utils/markdown_parser/parser.tsx`. Yozora-based
// parser seeded with the six custom Slack tokenizers. The default list
// tokenizer is unmounted because upstream handles lists inside rich_text
// blocks, not via mrkdwn (lists inside a `type: "mrkdwn"` text object
// render as literal text).

const parser = new YozoraParser()
  .unmountTokenizer("@yozora/tokenizer-list")
  .useTokenizer(new SlackUserMentionTokenizer())
  .useTokenizer(new SlackChannelMentionTokenizer())
  .useTokenizer(new SlackUserGroupMentionTokenizer())
  .useTokenizer(new SlackBroadcastTokenizer())
  .useTokenizer(new SlackDateTokenizer())
  .useTokenizer(new SlackEmojiTokenizer());

function isValidURL(s: string): boolean {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export function renderMrkdwn(markdown: string): ReactNode {
  if (!markdown) return null;
  let text = markdown;

  // Transform ``` fences so Yozora treats them as full code blocks.
  text = text.replace(/```/g, `\n\`\`\`\n`);
  // Slack uses single * for bold — convert to **.
  text = text.replace(/(?<!\*)\*(?!\*)([^*]+)\*(?!\*)/g, "**$1**");
  // Slack uses single ~ for strike — convert to ~~.
  text = text.replace(/(?<!~)~(?!~)([^~]+)~(?!~)/g, "~~$1~~");
  // <url|label>  →  [label](url)  (preserving Slack-date and non-urls).
  text = text.replace(/<(?!(?:!date))([^|>]+)\|([^>]+)>/g, (match, link, label) => {
    return isValidURL(link) ? `[${label}](${link})` : match;
  });
  // <url>  →  [url](url)  (preserving Slack-date and non-urls).
  text = text.replace(/<(?!(?:!date))([^|>]+)>/g, (match, link) => {
    return isValidURL(link) ? `[${link}](${link})` : match;
  });
  // Prevent _ underscore emphasis from swallowing a line break.
  text = text.replace(/_\n/g, "_ \n");
  // Avoid emoji parsing mis-firing on `:\n`.
  text = text.replace(/:\n/g, ": \n");
  // Preserve multi-blank-line runs as LBKS markers (paragraph.tsx
  // reconstitutes them as explicit line breaks).
  text = text.replace(/\n\n(\n*)/g, (_, extraNewlines) => {
    return "\n\n" + "LBKS".repeat(extraNewlines.length);
  });
  // Ensure a blockquote line isn't merged with the next paragraph.
  text = text.replace(/^>.*$(?!\n>)/gm, "$&\n");
  // Literal broadcast tokens → @-prefixed for the broadcast tokenizer.
  text = text.replace(/<!here>/g, "@here");
  text = text.replace(/<!everyone>/g, "@everyone");
  text = text.replace(/<!channel>/g, "@channel");

  const ast = parser.parse(text);
  const elements = ast.children as unknown as MarkdownElement[];

  return (
    <>
      {elements.map((el, i) => {
        if (el.type === "paragraph")
          return <Paragraph key={i} element={el} isFirst={i === 0} />;
        if (el.type === "blockquote")
          return <Blockquote key={i} element={el} />;
        if (el.type === "code") return <Code key={i} element={el} />;
        return null;
      })}
    </>
  );
}
