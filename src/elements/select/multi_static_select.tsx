import { useOnAction } from "../../components-registry";
import { BaseSelect, type SelectOption, type SelectGroup } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject, TextObject } from "../../types";

type OptionSpec = {
  text: TextObject;
  value: string;
  description?: PlainTextObject;
};

export interface MultiStaticSelectData {
  type: "multi_static_select";
  action_id: string;
  placeholder?: PlainTextObject;
  options?: OptionSpec[];
  option_groups?: { label: PlainTextObject; options: OptionSpec[] }[];
  initial_options?: OptionSpec[];
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
  max_selected_items?: number;
}

function toOption(o: OptionSpec): SelectOption {
  return {
    value: o.value,
    label: o.text.text,
    description: o.description?.text,
  };
}

export function MultiStaticSelectElement({
  element,
}: {
  element: MultiStaticSelectData;
}) {
  const onAction = useOnAction();
  const options = element.options?.map(toOption);
  const option_groups: SelectGroup[] | undefined = element.option_groups?.map(
    (g) => ({ label: g.label.text, options: g.options.map(toOption) }),
  );
  const initial = element.initial_options?.map(toOption) ?? [];
  return (
    <BaseSelect
      multi
      options={options}
      option_groups={option_groups}
      initial={initial}
      placeholder={element.placeholder?.text}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      max_selected_items={element.max_selected_items}
      onCommit={(sel) => {
        onAction?.({
          type: "multi_static_select",
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
