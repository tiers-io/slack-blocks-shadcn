import { Button } from "../ui/button";
import { useSize } from "../context";
import { useOnAction } from "../components-registry";

// Icon button: shown as a compact outline square. Slack exposes an
// `icon` string that names an SVG; we don't ship that sprite, so we
// render a minimal glyph and rely on the accessibility label.

export interface IconButtonElementData {
  type: "icon_button";
  action_id: string;
  icon: string;
  url?: string;
  text?: { type: "plain_text"; text: string };
  accessibility_label?: string;
}

export function IconButtonElement({
  element,
}: {
  element: IconButtonElementData;
}) {
  const size = useSize();
  const onAction = useOnAction();
  const uiSize =
    size === "sm" ? "icon-xs" : size === "lg" ? "icon" : "icon-sm";
  const aria =
    element.accessibility_label ?? element.text?.text ?? element.icon;
  if (element.url) {
    return (
      <a
        href={element.url}
        target="_blank"
        rel="noreferrer"
        aria-label={aria}
        title={aria}
        data-element="icon_button"
        className="inline-flex items-center justify-center rounded-md border text-muted-foreground hover:bg-accent hover:text-foreground h-8 w-8"
      >
        <span aria-hidden>·</span>
      </a>
    );
  }
  return (
    <Button
      type="button"
      size={uiSize}
      variant="outline"
      aria-label={aria}
      title={aria}
      data-element="icon_button"
      onClick={() =>
        onAction?.({
          type: "icon_button",
          action_id: element.action_id,
        })
      }
    >
      <span aria-hidden>·</span>
    </Button>
  );
}
