import { useOnAction } from "../../components-registry";
import { useData } from "../../context";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject } from "../../types";

export interface ConversationsSelectData {
  type: "conversations_select";
  action_id: string;
  placeholder?: PlainTextObject;
  initial_conversation?: string;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

export function ConversationsSelectElement({
  element,
}: {
  element: ConversationsSelectData;
}) {
  const onAction = useOnAction();
  const data = useData();
  // Conversations = channels + users. Slack's client combines them into
  // a single typeahead dropdown. We mirror that by merging both lists.
  const channels: SelectOption[] =
    data.channels?.map((c) => ({ value: c.id, label: `#${c.name}` })) ?? [];
  const users: SelectOption[] =
    data.users?.map((u) => ({ value: u.id, label: `@${u.name}` })) ?? [];
  const options = [...channels, ...users];
  const initial = element.initial_conversation
    ? options.filter((o) => o.value === element.initial_conversation)
    : [];
  return (
    <BaseSelect
      multi={false}
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text ?? "Select a conversation"}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      onCommit={(sel) => {
        onAction?.({
          type: "conversations_select",
          action_id: element.action_id,
          selected_conversation: sel[0]?.value ?? null,
        });
      }}
    />
  );
}
