import { Button } from "../ui/button";
import type { PlainTextObject } from "../types";
import { useSize } from "../context";
import { cn } from "../utils/cn";

// Shared wrapper for every button-ish element type. Maps Slack's `style`
// field to one of our Button variants, uses our size context to pick a
// size, and renders as an anchor when a url is present.

export type SlackButtonStyle = "primary" | "danger" | undefined;

function mapVariant(
  style: SlackButtonStyle,
): "default" | "destructive" | "outline" {
  if (style === "primary") return "default";
  if (style === "danger") return "destructive";
  return "outline";
}

function mapSize(size: "sm" | "default" | "lg"): "xs" | "sm" | "default" {
  return size === "sm" ? "xs" : size === "lg" ? "default" : "sm";
}

export interface ButtonElementData {
  type: "button";
  action_id?: string;
  text: PlainTextObject;
  url?: string;
  value?: string;
  style?: SlackButtonStyle;
  accessibility_label?: string;
}

export function ButtonElement({ element }: { element: ButtonElementData }) {
  const size = useSize();
  const variant = mapVariant(element.style);
  const uiSize = mapSize(size);
  const label = element.text.text;
  const aria = element.accessibility_label ?? label;

  if (element.url) {
    // Render as an anchor styled with Button classes — keeps keyboard /
    // screen-reader semantics without wiring our own link click handler.
    return (
      <a
        href={element.url}
        target="_blank"
        rel="noreferrer"
        aria-label={aria}
        data-element="button"
        data-variant={variant}
        className={cn(
          // Button's class output is stable enough for a compose-via-class.
          "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium no-underline transition-all",
          variant === "default" &&
            "bg-primary text-primary-foreground hover:bg-primary/90",
          variant === "destructive" &&
            "bg-destructive text-white hover:bg-destructive/90",
          variant === "outline" &&
            "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
          uiSize === "xs" && "h-6 px-2 text-xs",
          uiSize === "sm" && "h-8 px-3",
          uiSize === "default" && "h-9 px-4 py-2",
        )}
      >
        {label}
      </a>
    );
  }
  return (
    <Button
      variant={variant}
      size={uiSize}
      disabled
      data-element="button"
      aria-label={aria}
      title="Open in Slack to respond"
    >
      {label}
    </Button>
  );
}
