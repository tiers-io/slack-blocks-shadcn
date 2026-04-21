import { useOnAction } from "../../components-registry";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject, TextObject } from "../../types";

type OptionSpec = { text: TextObject; value: string };

// External-source selects in Slack call back to the app to fetch their
// options. We can't round-trip to Slack, so options must be pre-
// materialised and passed in as `options`. `initial_option` fills the
// selected state.

export interface ExternalSelectData {
  type: "external_select";
  action_id: string;
  placeholder?: PlainTextObject;
  options?: OptionSpec[];
  initial_option?: OptionSpec;
  min_query_length?: number;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

function toOption(o: OptionSpec): SelectOption {
  return { value: o.value, label: o.text.text };
}

export function ExternalSelectElement({
  element,
}: {
  element: ExternalSelectData;
}) {
  const onAction = useOnAction();
  const options = element.options?.map(toOption);
  const initial = element.initial_option
    ? [toOption(element.initial_option)]
    : [];
  return (
    <BaseSelect
      multi={false}
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      onCommit={(sel) => {
        onAction?.({
          type: "external_select",
          action_id: element.action_id,
          selected_option: sel[0]
            ? { value: sel[0].value, text: sel[0].label }
            : null,
        });
      }}
    />
  );
}
