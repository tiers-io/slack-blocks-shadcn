import { Button } from "../ui/button";
import { useSize } from "../context";

// Icon button: purely visual round-trip would need a rich icon name
// mapping. For now we render a square disabled button with the
// accessibility label as tooltip/aria.

export interface IconButtonElementData {
  type: "icon_button";
  action_id: string;
  icon: string;
  url?: string;
  accessibility_label?: string;
}

export function IconButtonElement({
  element,
}: {
  element: IconButtonElementData;
}) {
  const size = useSize();
  const uiSize =
    size === "sm" ? "icon-xs" : size === "lg" ? "icon" : "icon-sm";
  const aria = element.accessibility_label ?? element.icon;
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
      size={uiSize}
      variant="outline"
      disabled
      aria-label={aria}
      title="Open in Slack to respond"
      data-element="icon_button"
    >
      <span aria-hidden>·</span>
    </Button>
  );
}
