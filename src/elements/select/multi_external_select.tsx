import { useOnAction } from "../../components-registry";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject, TextObject } from "../../types";

type OptionSpec = { text: TextObject; value: string };

export interface MultiExternalSelectData {
  type: "multi_external_select";
  action_id: string;
  placeholder?: PlainTextObject;
  options?: OptionSpec[];
  initial_options?: OptionSpec[];
  min_query_length?: number;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
  max_selected_items?: number;
}

function toOption(o: OptionSpec): SelectOption {
  return { value: o.value, label: o.text.text };
}

export function MultiExternalSelectElement({
  element,
}: {
  element: MultiExternalSelectData;
}) {
  const onAction = useOnAction();
  const options = element.options?.map(toOption);
  const initial = element.initial_options?.map(toOption) ?? [];
  return (
    <BaseSelect
      multi
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      max_selected_items={element.max_selected_items}
      onCommit={(sel) => {
        onAction?.({
          type: "multi_external_select",
          action_id: element.action_id,
          selected_options: sel.map((s) => ({
            value: s.value,
            text: s.label,
          })),
        });
      }}
    />
  );
}
