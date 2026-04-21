import { useData, useHooks } from "../../context";
import { useComponent } from "../../components-registry";
import type { SlackChannelMentionSubElement } from "../ast-types";

export function SlackChannelMention({
  element,
}: {
  element: SlackChannelMentionSubElement;
}) {
  const hooks = useHooks();
  const data = useData();
  const MentionPill = useComponent("MentionPill");
  const channel_id = element.value;
  const resolved = data.channels?.find(
    (c) => c.id === channel_id || c.name === channel_id,
  );
  const display = resolved?.name ?? channel_id;
  if (hooks.channel) {
    return <>{hooks.channel({ channel_id, name: display })}</>;
  }
  return <MentionPill variant="channel">#{display}</MentionPill>;
}
