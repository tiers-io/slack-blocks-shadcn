import { useOnAction } from "../../components-registry";
import { useData } from "../../context";
import { BaseSelect, type SelectOption } from "./base";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";
import type { PlainTextObject } from "../../types";

export interface ChannelsSelectData {
  type: "channels_select";
  action_id: string;
  placeholder?: PlainTextObject;
  initial_channel?: string;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

export function ChannelsSelectElement({
  element,
}: {
  element: ChannelsSelectData;
}) {
  const onAction = useOnAction();
  const data = useData();
  const options: SelectOption[] =
    data.channels?.map((c) => ({ value: c.id, label: `#${c.name}` })) ?? [];
  const initial = element.initial_channel
    ? options.filter((o) => o.value === element.initial_channel)
    : [];
  return (
    <BaseSelect
      multi={false}
      options={options}
      initial={initial}
      placeholder={element.placeholder?.text ?? "Select a channel"}
      confirm={element.confirm}
      focus_on_load={element.focus_on_load}
      onCommit={(sel) => {
        onAction?.({
          type: "channels_select",
          action_id: element.action_id,
          selected_channel: sel[0]?.value ?? null,
        });
      }}
    />
  );
}
