import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { useSize } from "../context";

// Read-only render for every select variant (static/users/channels/
// conversations/external + their multi_* twins). Shows the placeholder
// or initial option label with a chevron, disabled; clicks punt to Slack.

type Variant =
  | "static_select"
  | "external_select"
  | "users_select"
  | "channels_select"
  | "conversations_select"
  | "multi_static_select"
  | "multi_external_select"
  | "multi_users_select"
  | "multi_channels_select"
  | "multi_conversations_select";

interface OptionLike {
  text?: { text?: string };
  value?: string;
}

export interface SelectElementData {
  type: Variant;
  action_id?: string;
  placeholder?: { text: string };
  initial_option?: OptionLike;
  initial_options?: OptionLike[];
  initial_user?: string;
  initial_users?: string[];
  initial_channel?: string;
  initial_channels?: string[];
  initial_conversation?: string;
  initial_conversations?: string[];
}

function previewLabel(el: SelectElementData): string {
  const placeholder = el.placeholder?.text ?? "Select…";
  if (el.initial_option?.text?.text) return el.initial_option.text.text;
  if (el.initial_options?.length) {
    const labels = el.initial_options
      .map((o) => o.text?.text)
      .filter((x): x is string => Boolean(x));
    if (labels.length) return labels.join(", ");
  }
  if (el.initial_user) return `@${el.initial_user}`;
  if (el.initial_users?.length)
    return el.initial_users.map((u) => `@${u}`).join(", ");
  if (el.initial_channel) return `#${el.initial_channel}`;
  if (el.initial_channels?.length)
    return el.initial_channels.map((c) => `#${c}`).join(", ");
  return placeholder;
}

export function SelectElement({ element }: { element: SelectElementData }) {
  const size = useSize();
  const uiSize = size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
  const label = previewLabel(element);
  return (
    <Button
      variant="outline"
      size={uiSize}
      disabled
      data-element={element.type}
      title="Open in Slack to change"
      className="justify-between gap-2 min-w-[8rem]"
    >
      <span className="truncate text-left">{label}</span>
      <ChevronDown className="opacity-50" />
    </Button>
  );
}
