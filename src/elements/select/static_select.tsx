import { useOnAction } from "../../components-registry";
import { BaseSelect, type SelectOption, type SelectGroup } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject, TextObject } from "../../types";

type OptionSpec = {
  text: TextObject;
  value: string;
  description?: PlainTextObject;
};

export interface StaticSelectData {
  type: "static_select";
  action_id: string;
  placeholder?: PlainTextObject;
  options?: OptionSpec[];
  option_groups?: { label: PlainTextObject; options: OptionSpec[] }[];
  initial_option?: OptionSpec;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

function toOption(o: OptionSpec): SelectOption {
  return {
    value: o.value,
    label: o.text.text,
    description: o.description?.text,
  };
}

export function StaticSelectElement({
  element,
}: {
  element: StaticSelectData;
}) {
  const onAction = useOnAction();
  const options = element.options?.map(toOption);
  const option_groups: SelectGroup[] | undefined = element.option_groups?.map(
    (g) => ({ label: g.label.text, options: g.options.map(toOption) }),
  );
  const initial = element.initial_option ? [toOption(element.initial_option)] : [];
  return (
    <BaseSelect
      multi={false}
      options={options}
      option_groups={option_groups}
      initial={initial}
      placeholder={element.placeholder?.text}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      onCommit={(sel) => {
        onAction?.({
          type: "static_select",
          action_id: element.action_id,
          selected_option: sel[0]
            ? { value: sel[0].value, text: sel[0].label }
            : null,
        });
      }}
    />
  );
}
