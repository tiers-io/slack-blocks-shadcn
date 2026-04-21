import type { ReactNode } from "react";
import { MentionPill } from "../../../composition/MentionPill";
import { useHooks, useData } from "../../../context";
import { cn } from "../../../utils/cn";
import { styleToClass } from "./style";
import type {
  RichTextStyle,
  RichTextUser,
  RichTextChannel,
  RichTextUsergroup,
  RichTextBroadcast,
} from "../types";

function withStyle(node: ReactNode, style: RichTextStyle | undefined): JSX.Element {
  const cls = styleToClass(style);
  if (!cls) return <>{node}</>;
  return <span className={cn(cls)}>{node}</span>;
}

export function UserElement({ element }: { element: RichTextUser }) {
  const hooks = useHooks();
  const data = useData();
  const resolved = data.users?.find((u) => u.id === element.user_id);
  const display = resolved?.name ?? element.user_id;
  if (element.style?.unlink) {
    return withStyle(<>@{display}</>, element.style);
  }
  const pill = hooks.user ? (
    <>
      {hooks.user({
        user_id: element.user_id,
        name: display,
        avatar: resolved?.avatar,
      })}
    </>
  ) : (
    <MentionPill variant="user">@{display}</MentionPill>
  );
  return withStyle(pill, element.style);
}

export function ChannelElement({ element }: { element: RichTextChannel }) {
  const hooks = useHooks();
  const data = useData();
  const resolved = data.channels?.find((c) => c.id === element.channel_id);
  const display = resolved?.name ?? element.channel_id;
  if (element.style?.unlink) {
    return withStyle(<>#{display}</>, element.style);
  }
  const pill = hooks.channel ? (
    <>{hooks.channel({ channel_id: element.channel_id, name: display })}</>
  ) : (
    <MentionPill variant="channel">#{display}</MentionPill>
  );
  return withStyle(pill, element.style);
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
  if (element.style?.unlink) {
    return withStyle(<>@{display}</>, element.style);
  }
  const pill = hooks.usergroup ? (
    <>
      {hooks.usergroup({ usergroup_id: element.usergroup_id, name: display })}
    </>
  ) : (
    <MentionPill variant="usergroup">@{display}</MentionPill>
  );
  return withStyle(pill, element.style);
}

export function BroadcastElement({ element }: { element: RichTextBroadcast }) {
  const hooks = useHooks();
  const pill =
    element.range === "everyone" && hooks.atEveryone ? (
      <>{hooks.atEveryone()}</>
    ) : element.range === "channel" && hooks.atChannel ? (
      <>{hooks.atChannel()}</>
    ) : element.range === "here" && hooks.atHere ? (
      <>{hooks.atHere()}</>
    ) : (
      <MentionPill variant="broadcast">{`@${element.range}`}</MentionPill>
    );
  return withStyle(pill, element.style);
}
