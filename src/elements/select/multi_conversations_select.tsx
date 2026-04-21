import { useOnAction } from "../../components-registry";
import { useData } from "../../context";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject } from "../../types";

export interface MultiConversationsSelectData {
  type: "multi_conversations_select";
  action_id: string;
  placeholder?: PlainTextObject;
  initial_conversations?: string[];
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
  max_selected_items?: number;
}

export function MultiConversationsSelectElement({
  element,
}: {
  element: MultiConversationsSelectData;
}) {
  const onAction = useOnAction();
  const data = useData();
  const channels: SelectOption[] =
    data.channels?.map((c) => ({ value: c.id, label: `#${c.name}` })) ?? [];
  const users: SelectOption[] =
    data.users?.map((u) => ({ value: u.id, label: `@${u.name}` })) ?? [];
  const options = [...channels, ...users];
  const initial = element.initial_conversations
    ? options.filter((o) => element.initial_conversations!.includes(o.value))
    : [];
  return (
    <BaseSelect
      multi
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text ?? "Select conversations"}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      max_selected_items={element.max_selected_items}
      onCommit={(sel) => {
        onAction?.({
          type: "multi_conversations_select",
          action_id: element.action_id,
          selected_conversations: sel.map((s) => s.value),
        });
      }}
    />
  );
}
