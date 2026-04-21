import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "../../ui/button";
import { Popover } from "../../ui/popover";
import { useSize } from "../../context";
import { useComponent, useOnAction } from "../../components-registry";
import { cn } from "../../utils/cn";
import type { ConfirmDialogSpec } from "../../composition/ConfirmDialog";

export interface TimepickerData {
  type: "timepicker";
  action_id: string;
  initial_time?: string; // HH:mm
  placeholder?: { text: string };
  timezone?: string;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

function pickerSize(size: "sm" | "default" | "lg"): "xs" | "sm" | "default" {
  return size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function parseHHmm(value: string | undefined): { h: number; m: number } {
  if (!value) return { h: 12, m: 0 };
  const [hs, ms] = value.split(":");
  return {
    h: clamp(Number(hs) || 0, 0, 23),
    m: clamp(Number(ms) || 0, 0, 59),
  };
}

function formatHHmm(h: number, m: number): string {
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function Timepicker({ element }: { element: TimepickerData }) {
  const size = useSize();
  const onAction = useOnAction();
  const ConfirmDialog = useComponent("ConfirmDialog");
  const [value, setValue] = useState<string | undefined>(element.initial_time);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<string | null>(null);
  const { h: initialH, m: initialM } = parseHHmm(value);
  const [h, setH] = useState(initialH);
  const [m, setM] = useState(initialM);

  const commit = () => {
    const next = formatHHmm(h, m);
    if (element.confirm) {
      setPending(next);
      return;
    }
    setValue(next);
    onAction?.({
      type: "timepicker",
      action_id: element.action_id,
      selected_time: next,
    });
    setOpen(false);
  };

  const label = value ?? element.placeholder?.text ?? "Select time";

  return (
    <>
      <Popover
        open={open}
        onOpenChange={setOpen}
        contentClassName="w-auto p-3"
        trigger={
          <Button
            type="button"
            variant="outline"
            size={pickerSize(size)}
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-haspopup="dialog"
            data-element="timepicker"
            className="gap-2"
          >
            <Clock />
            {label}
            {element.timezone ? (
              <span className="ml-1 text-muted-foreground">
                {element.timezone}
              </span>
            ) : null}
          </Button>
        }
      >
        <div className="flex items-center gap-2">
          <label className="flex flex-col items-center text-xs text-muted-foreground">
            HH
            <input
              type="number"
              min={0}
              max={23}
              value={h}
              onChange={(e) =>
                setH(clamp(Number(e.target.value) || 0, 0, 23))
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
                setM(clamp(Number(e.target.value) || 0, 0, 59))
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
            aria-label="Set time"
            className="ml-2 self-end"
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
            if (pending) {
              setValue(pending);
              onAction?.({
                type: "timepicker",
                action_id: element.action_id,
                selected_time: pending,
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
