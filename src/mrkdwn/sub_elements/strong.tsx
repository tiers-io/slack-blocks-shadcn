import type { StrongSubElement } from "../ast-types";
import { Delete } from "./delete";
import { Emphasis } from "./emphasis";
import { Link } from "./link";
import { SlackBroadcast } from "./slack_broadcast";
import { SlackChannelMention } from "./slack_channel_mention";
import { SlackDate } from "./slack_date";
import { SlackEmoji } from "./slack_emoji";
import { SlackUserGroupMention } from "./slack_user_group_mention";
import { SlackUserMention } from "./slack_user_mention";
import { Text } from "./text";

export function Strong({ element }: { element: StrongSubElement }) {
  return (
    <strong className="font-semibold">
      {element.children.map((child, i) => {
        if (child.type === "text") return <Text key={i} element={child} />;
        if (child.type === "delete") return <Delete key={i} element={child} />;
        if (child.type === "emphasis") return <Emphasis key={i} element={child} />;
        if (child.type === "link") return <Link key={i} element={child} />;
        if (child.type === "slack_broadcast") return <SlackBroadcast key={i} element={child} />;
        if (child.type === "slack_channel_mention") return <SlackChannelMention key={i} element={child} />;
        if (child.type === "slack_date") return <SlackDate key={i} element={child} />;
        if (child.type === "slack_emoji") return <SlackEmoji key={i} element={child} />;
        if (child.type === "slack_user_group_mention") return <SlackUserGroupMention key={i} element={child} />;
        if (child.type === "slack_user_mention") return <SlackUserMention key={i} element={child} />;
        return null;
      })}
    </strong>
  );
}
