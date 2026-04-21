import { useData, useHooks } from "../../context";
import { useComponent } from "../../components-registry";
import type { SlackUserMentionSubElement } from "../ast-types";

export function SlackUserMention({
  element,
}: {
  element: SlackUserMentionSubElement;
}) {
  const hooks = useHooks();
  const data = useData();
  const MentionPill = useComponent("MentionPill");
  const user_id = element.value;
  const resolved = data.users?.find(
    (u) => u.id === user_id || u.name === user_id,
  );
  const display = resolved?.name ?? user_id;
  if (hooks.user) {
    return (
      <>
        {hooks.user({
          user_id,
          name: display,
          avatar: resolved?.avatar,
        })}
      </>
    );
  }
  return <MentionPill variant="user">@{display}</MentionPill>;
}
