import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import type { TextObject } from "../types";

export interface OverflowData {
  type: "overflow";
  action_id: string;
  options: Array<{ text: TextObject; value: string; url?: string }>;
}

// Overflow menus are three-dot dropdowns. Read-only render: a disabled
// icon button with tooltip listing the options (screen-reader-accessible
// via aria-label).

export function OverflowMenu({ element }: { element: OverflowData }) {
  const labels = element.options
    .map((o) => (o.text.type === "plain_text" ? o.text.text : o.value))
    .join(", ");
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      disabled
      aria-disabled="true"
      aria-label={`Overflow menu: ${labels}`}
      title="Open in Slack to see options"
      data-element="overflow"
    >
      <MoreHorizontal />
    </Button>
  );
}
