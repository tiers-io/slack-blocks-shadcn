import { Check, Circle } from "lucide-react";
import { cn } from "../utils/cn";
import { sizing } from "../sizing";
import { useSize } from "../context";
import type { TextObject } from "../types";
import { RenderTextObject } from "../composition/TextObject";

// Checkboxes and radio buttons. Slack's spec shares the `options[]` shape
// (array of option objects with `text` + `value` + optional `description`).
// We render as a vertical list of disabled controls so the selected state
// is visible without interaction.

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
}

export interface RadioButtonsData {
  type: "radio_buttons";
  action_id: string;
  options: OptionObject[];
  initial_option?: OptionObject;
}

function optionChecked(
  opt: OptionObject,
  selected?: OptionObject[] | OptionObject,
): boolean {
  if (!selected) return false;
  if (Array.isArray(selected)) {
    return selected.some((s) => s.value === opt.value);
  }
  return selected.value === opt.value;
}

export function Checkboxes({ element }: { element: CheckboxesData }) {
  const size = useSize();
  return (
    <ul data-element="checkboxes" className={cn("flex flex-col", sizing[size].gap)}>
      {element.options.map((opt, i) => {
        const checked = optionChecked(opt, element.initial_options);
        return (
          <li
            key={i}
            data-checked={checked}
            aria-disabled="true"
            className="flex items-start gap-2"
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
  );
}

export function RadioButtons({ element }: { element: RadioButtonsData }) {
  const size = useSize();
  return (
    <ul
      data-element="radio_buttons"
      role="radiogroup"
      className={cn("flex flex-col", sizing[size].gap)}
    >
      {element.options.map((opt, i) => {
        const checked = optionChecked(opt, element.initial_option);
        return (
          <li
            key={i}
            role="radio"
            aria-checked={checked}
            aria-disabled="true"
            data-checked={checked}
            className="flex items-start gap-2"
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
  );
}
