import {
  Delete,
  Emphasis,
  HTML,
  InlineCode,
  Link,
  SlackBroadcast,
  SlackChannelMention,
  SlackDate,
  SlackEmoji,
  SlackUserGroupMention,
  SlackUserMention,
  Strong,
  Text,
} from "../sub_elements";
import type { ParagraphElement } from "../ast-types";

// Ported from upstream `elements/paragraph.tsx`. Leading "LBKS" markers
// (injected in parser.tsx to preserve runs of blank lines that Yozora
// collapses) become explicit blank-line spans before the <p>.

function processLeadingLineBreaks(children: ParagraphElement["children"]) {
  if (children.length === 0) {
    return { extraLineBreaks: 0, processedChildren: children };
  }
  const firstChild = children[0];
  if (firstChild?.type !== "text") {
    return { extraLineBreaks: 0, processedChildren: children };
  }
  const match = firstChild.value.match(/^(LBKS)+/);
  if (!match) return { extraLineBreaks: 0, processedChildren: children };
  const lbksCount = match[0].length / 4;
  const remainingText = firstChild.value.slice(match[0].length);
  const processedChildren = [...children];
  if (remainingText) {
    processedChildren[0] = { ...firstChild, value: remainingText };
  } else {
    processedChildren.shift();
  }
  return { extraLineBreaks: lbksCount, processedChildren };
}

export function Paragraph({
  element,
  isFirst = false,
}: {
  element: ParagraphElement;
  isFirst?: boolean;
}) {
  const { extraLineBreaks, processedChildren } = processLeadingLineBreaks(
    element.children,
  );
  return (
    <>
      {Array.from({ length: extraLineBreaks }).map((_, i) => (
        <span key={`lb-${i}`} className="block h-[1.2em]" />
      ))}
      <p className={isFirst ? undefined : "mt-[0.3em]"}>
        {processedChildren.map((sub, i) => {
          if (sub.type === "text") return <Text key={i} element={sub} />;
          if (sub.type === "html") return <HTML key={i} element={sub} />;
          if (sub.type === "emphasis") return <Emphasis key={i} element={sub} />;
          if (sub.type === "inlineCode") return <InlineCode key={i} element={sub} />;
          if (sub.type === "delete") return <Delete key={i} element={sub} />;
          if (sub.type === "strong") return <Strong key={i} element={sub} />;
          if (sub.type === "link") return <Link key={i} element={sub} />;
          if (sub.type === "slack_user_mention")
            return <SlackUserMention key={i} element={sub} />;
          if (sub.type === "slack_channel_mention")
            return <SlackChannelMention key={i} element={sub} />;
          if (sub.type === "slack_user_group_mention")
            return <SlackUserGroupMention key={i} element={sub} />;
          if (sub.type === "slack_broadcast")
            return <SlackBroadcast key={i} element={sub} />;
          if (sub.type === "slack_date") return <SlackDate key={i} element={sub} />;
          if (sub.type === "slack_emoji") return <SlackEmoji key={i} element={sub} />;
          return null;
        })}
      </p>
    </>
  );
}
