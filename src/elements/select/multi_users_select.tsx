import { useOnAction } from "../../components-registry";
import { useData } from "../../context";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject } from "../../types";

export interface MultiUsersSelectData {
  type: "multi_users_select";
  action_id: string;
  placeholder?: PlainTextObject;
  initial_users?: string[];
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
  max_selected_items?: number;
}

export function MultiUsersSelectElement({
  element,
}: {
  element: MultiUsersSelectData;
}) {
  const onAction = useOnAction();
  const data = useData();
  const options: SelectOption[] =
    data.users?.map((u) => ({ value: u.id, label: `@${u.name}` })) ?? [];
  const initial = element.initial_users
    ? options.filter((o) => element.initial_users!.includes(o.value))
    : [];
  return (
    <BaseSelect
      multi
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text ?? "Select users"}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      max_selected_items={element.max_selected_items}
      onCommit={(sel) => {
        onAction?.({
          type: "multi_users_select",
          action_id: element.action_id,
          selected_users: sel.map((s) => s.value),
        });
      }}
    />
  );
}
