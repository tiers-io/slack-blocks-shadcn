import { useOnAction } from "../../components-registry";
import { useData } from "../../context";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject } from "../../types";

export interface UsersSelectData {
  type: "users_select";
  action_id: string;
  placeholder?: PlainTextObject;
  initial_user?: string;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

export function UsersSelectElement({
  element,
}: {
  element: UsersSelectData;
}) {
  const onAction = useOnAction();
  const data = useData();
  const options: SelectOption[] =
    data.users?.map((u) => ({ value: u.id, label: `@${u.name}` })) ?? [];
  const initial = element.initial_user
    ? options.filter((o) => o.value === element.initial_user)
    : [];
  return (
    <BaseSelect
      multi={false}
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text ?? "Select a user"}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      onCommit={(sel) => {
        onAction?.({
          type: "users_select",
          action_id: element.action_id,
          selected_user: sel[0]?.value ?? null,
        });
      }}
    />
  );
}
