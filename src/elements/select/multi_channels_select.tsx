import { useOnAction } from "../../components-registry";
import { useData } from "../../context";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject } from "../../types";

export interface MultiChannelsSelectData {
  type: "multi_channels_select";
  action_id: string;
  placeholder?: PlainTextObject;
  initial_channels?: string[];
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
  max_selected_items?: number;
}

export function MultiChannelsSelectElement({
  element,
}: {
  element: MultiChannelsSelectData;
}) {
  const onAction = useOnAction();
  const data = useData();
  const options: SelectOption[] =
    data.channels?.map((c) => ({ value: c.id, label: `#${c.name}` })) ?? [];
  const initial = element.initial_channels
    ? options.filter((o) => element.initial_channels!.includes(o.value))
    : [];
  return (
    <BaseSelect
      multi
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text ?? "Select channels"}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      max_selected_items={element.max_selected_items}
      onCommit={(sel) => {
        onAction?.({
          type: "multi_channels_select",
          action_id: element.action_id,
          selected_channels: sel.map((s) => s.value),
        });
      }}
    />
  );
}
