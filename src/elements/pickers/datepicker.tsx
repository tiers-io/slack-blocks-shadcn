import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Popover } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { useSize } from "../../context";
import { useComponent, useOnAction } from "../../components-registry";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";

export interface DatepickerData {
  type: "datepicker";
  action_id: string;
  initial_date?: string; // YYYY-MM-DD
  placeholder?: { text: string };
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

function pickerSize(size: "sm" | "default" | "lg"): "xs" | "sm" | "default" {
  return size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
}

export function Datepicker({ element }: { element: DatepickerData }) {
  const size = useSize();
  const onAction = useOnAction();
  const ConfirmDialog = useComponent("ConfirmDialog");
  const [value, setValue] = useState<string | undefined>(element.initial_date);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);

  const commit = (next: string) => {
    if (element.confirm) {
      setPending(next);
      return;
    }
    setValue(next);
    onAction?.({
      type: "datepicker",
      action_id: element.action_id,
      selected_date: next,
    });
    setOpen(false);
  };

  const label = value ?? element.placeholder?.text ?? "Select date";

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        contentClassName="w-auto"
        trigger={
          <Button
            type="button"
            variant="outline"
            size={pickerSize(size)}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="dialog"
            data-element="datepicker"
            className="gap-2"
          >
            <CalendarIcon />
            {label}
          </Button>
        }
      >
        <Calendar value={value} onChange={commit} />
      </Popover>
      {element.confirm ? (
        <ConfirmDialog
          open={pending !== null}
          onOpenChange={(v) => !v && setPending(null)}
          spec={element.confirm}
          onConfirm={() => {
            if (pending) {
              setValue(pending);
              onAction?.({
                type: "datepicker",
                action_id: element.action_id,
                selected_date: pending,
              });
              setOpen(false);
            }
            setPending(null);
          }}
          onDeny={() => setPending(null)}
        />
      ) : null}
    </>
  );
}
