import { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Popover } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { useSize } from "../../context";
import { useComponent, useOnAction } from "../../components-registry";
import { cn } from "../../utils/cn";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";

export interface DatetimepickerData {
  type: "datetimepicker";
  action_id: string;
  initial_date_time?: number; // unix seconds
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

function pickerSize(size: "sm" | "default" | "lg"): "xs" | "sm" | "default" {
  return size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function unixToISODate(ts: number): string {
  const d = new Date(ts * 1000);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function unixToHM(ts: number): { h: number; m: number } {
  const d = new Date(ts * 1000);
  return { h: d.getHours(), m: d.getMinutes() };
}

function toUnixSeconds(date: string, h: number, m: number): number {
  const [y, mo, d] = date.split("-").map(Number);
  const dt = new Date(y!, mo! - 1, d!, h, m);
  return Math.floor(dt.getTime() / 1000);
}

export function Datetimepicker({
  element,
}: {
  element: DatetimepickerData;
}) {
  const size = useSize();
  const onAction = useOnAction();
  const ConfirmDialog = useComponent("ConfirmDialog");
  const initial = element.initial_date_time;
  const [date, setDate] = useState(
    initial ? unixToISODate(initial) : undefined,
  );
  const [{ h, m }, setHM] = useState(
    initial ? unixToHM(initial) : { h: 12, m: 0 },
  );
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<number | null>(null);

  const commit = () => {
    if (!date) return;
    const next = toUnixSeconds(date, h, m);
    if (element.confirm) {
      setPending(next);
      return;
    }
    onAction?.({
      type: "datetimepicker",
      action_id: element.action_id,
      selected_date_time: next,
    });
    setOpen(false);
  };

  const label = date
    ? `${date} ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    : "Select date & time";

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        contentClassName="w-auto p-0"
        trigger={
          <Button
            type="button"
            variant="outline"
            size={pickerSize(size)}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="dialog"
            data-element="datetimepicker"
            className="gap-2"
          >
            <CalendarIcon />
            {label}
          </Button>
        }
      >
        <Calendar value={date} onChange={setDate} />
        <div className="flex items-center gap-2 border-t px-3 py-2">
          <label className="flex flex-col items-center text-xs text-muted-foreground">
            HH
            <input
              type="number"
              min={0}
              max={23}
              value={h}
              onChange={(e) =>
                setHM({
                  h: clamp(Number(e.target.value) || 0, 0, 23),
                  m,
                })
              }
              className={cn(
                "mt-1 w-14 rounded-md border bg-background px-2 py-1 text-center text-sm",
              )}
            />
          </label>
          <span className="self-end pb-1">:</span>
          <label className="flex flex-col items-center text-xs text-muted-foreground">
            MM
            <input
              type="number"
              min={0}
              max={59}
              value={m}
              onChange={(e) =>
                setHM({
                  h,
                  m: clamp(Number(e.target.value) || 0, 0, 59),
                })
              }
              className={cn(
                "mt-1 w-14 rounded-md border bg-background px-2 py-1 text-center text-sm",
              )}
            />
          </label>
          <Button
            type="button"
            size="sm"
            onClick={commit}
            disabled={!date}
            aria-label="Set date & time"
            className="ml-auto self-end"
          >
            Set
          </Button>
        </div>
      </Popover>
      {element.confirm ? (
        <ConfirmDialog
          open={pending !== null}
          onOpenChange={(v) => !v && setPending(null)}
          spec={element.confirm}
          onConfirm={() => {
            if (pending != null) {
              onAction?.({
                type: "datetimepicker",
                action_id: element.action_id,
                selected_date_time: pending,
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
