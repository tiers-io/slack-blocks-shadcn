import type { EmphasisSubElement } from "../ast-types";
import { Delete } from "./delete";
import { Link } from "./link";
import { SlackBroadcast } from "./slack_broadcast";
import { SlackChannelMention } from "./slack_channel_mention";
import { SlackDate } from "./slack_date";
import { SlackEmoji } from "./slack_emoji";
import { SlackUserGroupMention } from "./slack_user_group_mention";
import { SlackUserMention } from "./slack_user_mention";
import { Strong } from "./strong";
import { Text } from "./text";

export function Emphasis({ element }: { element: EmphasisSubElement }) {
  return (
    <em className="italic">
      {element.children.map((child, i) => {
        if (child.type === "text") return <Text key={i} element={child} />;
        if (child.type === "delete") return <Delete key={i} element={child} />;
        if (child.type === "strong") return <Strong key={i} element={child} />;
        if (child.type === "link") return <Link key={i} element={child} />;
        if (child.type === "slack_broadcast") return <SlackBroadcast key={i} element={child} />;
        if (child.type === "slack_channel_mention") return <SlackChannelMention key={i} element={child} />;
        if (child.type === "slack_date") return <SlackDate key={i} element={child} />;
        if (child.type === "slack_emoji") return <SlackEmoji key={i} element={child} />;
        if (child.type === "slack_user_group_mention") return <SlackUserGroupMention key={i} element={child} />;
        if (child.type === "slack_user_mention") return <SlackUserMention key={i} element={child} />;
        return null;
      })}
    </em>
  );
}
