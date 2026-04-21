import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

// Slack's `feedback_buttons` element renders a thumbs-up / thumbs-down
// pair inline. We preserve the pair as two disabled ghost buttons.

export interface FeedbackButtonsElementData {
  type: "feedback_buttons";
  action_id: string;
  positive_button?: { accessibility_label?: string };
  negative_button?: { accessibility_label?: string };
}

export function FeedbackButtonsElement({
  element,
}: {
  element: FeedbackButtonsElementData;
}) {
  const upLabel =
    element.positive_button?.accessibility_label ?? "Thumbs up";
  const downLabel =
    element.negative_button?.accessibility_label ?? "Thumbs down";
  return (
    <div
      data-element="feedback_buttons"
      className="inline-flex items-center gap-1"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        disabled
        aria-label={upLabel}
        title="Open in Slack to respond"
      >
        <ThumbsUp />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        disabled
        aria-label={downLabel}
        title="Open in Slack to respond"
      >
        <ThumbsDown />
      </Button>
    </div>
  );
}
