import { useHooks } from "../../context";
import { useComponent } from "../../components-registry";
import type { SlackBroadcastSubElement } from "../ast-types";

export function SlackBroadcast({
  element,
}: {
  element: SlackBroadcastSubElement;
}) {
  const hooks = useHooks();
  const MentionPill = useComponent("MentionPill");
  const range = element.value;
  if (range === "everyone" && hooks.atEveryone) return <>{hooks.atEveryone()}</>;
  if (range === "channel" && hooks.atChannel) return <>{hooks.atChannel()}</>;
  if (range === "here" && hooks.atHere) return <>{hooks.atHere()}</>;
  return <MentionPill variant="broadcast">@{range}</MentionPill>;
}
