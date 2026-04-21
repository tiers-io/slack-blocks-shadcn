import { Calendar, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { useSize } from "../context";

// All three pickers render as disabled trigger buttons with their
// current value surfaced as the label, plus a matching lucide icon.

export interface DatepickerData {
  type: "datepicker";
  action_id: string;
  initial_date?: string; // YYYY-MM-DD
  placeholder?: { text: string };
}
export interface TimepickerData {
  type: "timepicker";
  action_id: string;
  initial_time?: string; // HH:mm
  placeholder?: { text: string };
  timezone?: string;
}
export interface DatetimepickerData {
  type: "datetimepicker";
  action_id: string;
  initial_date_time?: number; // unix seconds
}

function pickerSize(size: "sm" | "default" | "lg") {
  return size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
}

export function Datepicker({ element }: { element: DatepickerData }) {
  const size = useSize();
  const label = element.initial_date ?? element.placeholder?.text ?? "Select date";
  return (
    <Button
      variant="outline"
      size={pickerSize(size)}
      disabled
      aria-disabled="true"
      data-element="datepicker"
      title="Open in Slack to change"
      className="gap-2"
    >
      <Calendar />
      {label}
    </Button>
  );
}

export function Timepicker({ element }: { element: TimepickerData }) {
  const size = useSize();
  const label = element.initial_time ?? element.placeholder?.text ?? "Select time";
  return (
    <Button
      variant="outline"
      size={pickerSize(size)}
      disabled
      aria-disabled="true"
      data-element="timepicker"
      title="Open in Slack to change"
      className="gap-2"
    >
      <Clock />
      {label}
    </Button>
  );
}

export function Datetimepicker({
  element,
}: {
  element: DatetimepickerData;
}) {
  const size = useSize();
  const label = element.initial_date_time
    ? new Date(element.initial_date_time * 1000).toISOString().replace("T", " ").replace(/:\d{2}\.\d{3}Z$/, "")
    : "Select date & time";
  return (
    <Button
      variant="outline"
      size={pickerSize(size)}
      disabled
      aria-disabled="true"
      data-element="datetimepicker"
      title="Open in Slack to change"
      className="gap-2"
    >
      <Calendar />
      {label}
    </Button>
  );
}
