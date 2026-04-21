import { useState } from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import { useComponent, useOnAction } from "../components-registry";
import { RenderTextObject } from "../composition/TextObject";
import type { ConfirmDialogSpec } from "../composition/ConfirmDialog";
import type { TextObject } from "../types";

interface OptionObject {
  text: TextObject;
  value: string;
  description?: TextObject;
}

export interface CheckboxesData {
  type: "checkboxes";
  action_id: string;
  options: OptionObject[];
  initial_options?: OptionObject[];
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

export interface RadioButtonsData {
  type: "radio_buttons";
  action_id: string;
  options: OptionObject[];
  initial_option?: OptionObject;
  confirm?: ConfirmDialogSpec;
  focus_on_load?: boolean;
}

function textOf(t: TextObject): string {
  return t.text;
}

function toPayload(opts: OptionObject[]): { value: string; text: string }[] {
  return opts.map((o) => ({ value: o.value, text: textOf(o.text) }));
}

export function Checkboxes({ element }: { element: CheckboxesData }) {
  const size = useSize();
  const onAction = useOnAction();
  const ConfirmDialog = useComponent("ConfirmDialog");
  const [selected, setSelected] = useState<OptionObject[]>(
    element.initial_options ?? [],
  );
  const [pending, setPending] = useState<OptionObject[] | null>(null);

  const commit = (next: OptionObject[]) => {
    if (element.confirm) {
      setPending(next);
      return;
    }
    setSelected(next);
    onAction?.({
      type: "checkboxes",
      action_id: element.action_id,
      selected_options: toPayload(next),
    });
  };

  const toggle = (opt: OptionObject) => {
    const exists = selected.find((s) => s.value === opt.value);
    commit(
      exists
        ? selected.filter((s) => s.value !== opt.value)
        : [...selected, opt],
    );
  };

  return (
    <>
      <ul
        data-element="checkboxes"
        role="group"
        className={cn("flex flex-col", sizing[size].gap)}
      >
        {element.options.map((opt, i) => {
          const checked = selected.some((s) => s.value === opt.value);
          return (
            <li
              key={i}
              role="checkbox"
              aria-checked={checked}
              aria-label={textOf(opt.text)}
              data-checked={checked}
              onClick={() => toggle(opt)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(opt);
                }
              }}
              tabIndex={0}
              className="flex cursor-pointer items-start gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "mt-0.5 flex shrink-0 items-center justify-center rounded-sm border",
                  sizing[size].icon,
                  checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background",
                )}
              >
                {checked ? <Check className="h-3 w-3" /> : null}
              </span>
              <span className="min-w-0 flex-1">
                <div className={cn("text-foreground", sizing[size].body)}>
                  <RenderTextObject text={opt.text} />
                </div>
                {opt.description ? (
                  <div className={cn("text-muted-foreground", sizing[size].secondary)}>
                    <RenderTextObject text={opt.description} />
                  </div>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
      {element.confirm ? (
        <ConfirmDialog
          open={pending !== null}
          onOpenChange={(v) => !v && setPending(null)}
          spec={element.confirm}
          onConfirm={() => {
            if (pending) {
              setSelected(pending);
              onAction?.({
                type: "checkboxes",
                action_id: element.action_id,
                selected_options: toPayload(pending),
              });
            }
            setPending(null);
          }}
          onDeny={() => setPending(null)}
        />
      ) : null}
    </>
  );
}

export function RadioButtons({ element }: { element: RadioButtonsData }) {
  const size = useSize();
  const onAction = useOnAction();
  const ConfirmDialog = useComponent("ConfirmDialog");
  const [selected, setSelected] = useState<OptionObject | null>(
    element.initial_option ?? null,
  );
  const [pending, setPending] = useState<OptionObject | null>(null);

  const commit = (opt: OptionObject) => {
    if (element.confirm) {
      setPending(opt);
      return;
    }
    setSelected(opt);
    onAction?.({
      type: "radio_buttons",
      action_id: element.action_id,
      selected_option: { value: opt.value, text: textOf(opt.text) },
    });
  };

  return (
    <>
      <ul
        data-element="radio_buttons"
        role="radiogroup"
        className={cn("flex flex-col", sizing[size].gap)}
      >
        {element.options.map((opt, i) => {
          const checked = selected?.value === opt.value;
          return (
            <li
              key={i}
              role="radio"
              aria-checked={checked}
              aria-label={textOf(opt.text)}
              data-checked={checked}
              onClick={() => commit(opt)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  commit(opt);
                }
              }}
              tabIndex={0}
              className="flex cursor-pointer items-start gap-2 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "mt-0.5 flex shrink-0 items-center justify-center rounded-full border",
                  sizing[size].icon,
                  checked ? "border-primary" : "border-border",
                )}
              >
                {checked ? (
                  <Circle
                    className="h-2 w-2 fill-primary text-primary"
                    aria-hidden
                  />
                ) : null}
              </span>
              <span className="min-w-0 flex-1">
                <div className={cn("text-foreground", sizing[size].body)}>
                  <RenderTextObject text={opt.text} />
                </div>
                {opt.description ? (
                  <div className={cn("text-muted-foreground", sizing[size].secondary)}>
                    <RenderTextObject text={opt.description} />
                  </div>
                ) : null}
              </span>
            </li>
          );
        })}
      </ul>
      {element.confirm ? (
        <ConfirmDialog
          open={pending !== null}
          onOpenChange={(v) => !v && setPending(null)}
          spec={element.confirm}
          onConfirm={() => {
            if (pending) {
              setSelected(pending);
              onAction?.({
                type: "radio_buttons",
                action_id: element.action_id,
                selected_option: {
                  value: pending.value,
                  text: textOf(pending.text),
                },
              });
            }
            setPending(null);
          }}
          onDeny={() => setPending(null)}
        />
      ) : null}
    </>
  );
}
