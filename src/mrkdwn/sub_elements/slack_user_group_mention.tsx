import { useData, useHooks } from "../../context";
import { useComponent } from "../../components-registry";
import type { SlackUserGroupMentionSubElement } from "../ast-types";

export function SlackUserGroupMention({
  element,
}: {
  element: SlackUserGroupMentionSubElement;
}) {
  const hooks = useHooks();
  const data = useData();
  const MentionPill = useComponent("MentionPill");
  const usergroup_id = element.value;
  const resolved = data.user_groups?.find(
    (g) => g.id === usergroup_id || g.name === usergroup_id,
  );
  const display = resolved?.name ?? usergroup_id;
  if (hooks.usergroup) {
    return <>{hooks.usergroup({ usergroup_id, name: display })}</>;
  }
  return <MentionPill variant="usergroup">@{display}</MentionPill>;
}
