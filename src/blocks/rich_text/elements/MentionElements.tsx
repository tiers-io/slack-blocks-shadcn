import { MentionPill } from "../../../composition/MentionPill";
import { useHooks, useData } from "../../../context";
import type {
  RichTextUser,
  RichTextChannel,
  RichTextUsergroup,
  RichTextBroadcast,
} from "../types";

export function UserElement({ element }: { element: RichTextUser }) {
  const hooks = useHooks();
  const data = useData();
  const resolved = data.users?.find((u) => u.id === element.user_id);
  const display = resolved?.name ?? element.user_id;
  if (hooks.user) {
    return (
      <>
        {hooks.user({
          user_id: element.user_id,
          name: display,
          avatar: resolved?.avatar,
        })}
      </>
    );
  }
  return <MentionPill variant="user">@{display}</MentionPill>;
}

export function ChannelElement({ element }: { element: RichTextChannel }) {
  const hooks = useHooks();
  const data = useData();
  const resolved = data.channels?.find((c) => c.id === element.channel_id);
  const display = resolved?.name ?? element.channel_id;
  if (hooks.channel) {
    return (
      <>{hooks.channel({ channel_id: element.channel_id, name: display })}</>
    );
  }
  return <MentionPill variant="channel">#{display}</MentionPill>;
}

export function UsergroupElement({
  element,
}: {
  element: RichTextUsergroup;
}) {
  const hooks = useHooks();
  const data = useData();
  const resolved = data.user_groups?.find((g) => g.id === element.usergroup_id);
  const display = resolved?.name ?? element.usergroup_id;
  if (hooks.usergroup) {
    return (
      <>
        {hooks.usergroup({
          usergroup_id: element.usergroup_id,
          name: display,
        })}
      </>
    );
  }
  return <MentionPill variant="usergroup">@{display}</MentionPill>;
}

export function BroadcastElement({ element }: { element: RichTextBroadcast }) {
  const hooks = useHooks();
  if (element.range === "everyone" && hooks.atEveryone)
    return <>{hooks.atEveryone()}</>;
  if (element.range === "channel" && hooks.atChannel)
    return <>{hooks.atChannel()}</>;
  if (element.range === "here" && hooks.atHere) return <>{hooks.atHere()}</>;
  return (
    <MentionPill variant="broadcast">{`@${element.range}`}</MentionPill>
  );
}
