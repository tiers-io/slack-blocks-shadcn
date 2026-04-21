import { useState } from "react";
import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useOnAction } from "../components-registry";
import { cn } from "../utils/cn";

// Slack's `feedback_buttons` element renders a thumbs-up / thumbs-down
// pair inline. Upstream ships only positive/negative semantics; labels
// can be overridden via accessibility_label. Click emits onAction with
// value "positive" | "negative" plus optional payload values.

export interface FeedbackButtonData {
  accessibility_label?: string;
  value?: string;
  text?: { type: "plain_text"; text: string };
}

export interface FeedbackButtonsElementData {
  type: "feedback_buttons";
  action_id: string;
  positive_button?: FeedbackButtonData;
  negative_button?: FeedbackButtonData;
}

export function FeedbackButtonsElement({
  element,
}: {
  element: FeedbackButtonsElementData;
}) {
  const onAction = useOnAction();
  const [chosen, setChosen] = useState<"positive" | "negative" | null>(null);

  const upLabel =
    element.positive_button?.accessibility_label ?? "Positive feedback";
  const downLabel =
    element.negative_button?.accessibility_label ?? "Negative feedback";

  const emit = (side: "positive" | "negative") => {
    setChosen(side);
    const btn =
      side === "positive" ? element.positive_button : element.negative_button;
    onAction?.({
      type: "feedback_buttons",
      action_id: element.action_id,
      value: side === "positive" ? "up" : "down",
      payload_value: btn?.value,
    });
  };

  return (
    <div
      data-element="feedback_buttons"
      className="inline-flex items-center gap-1"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={upLabel}
        aria-pressed={chosen === "positive"}
        data-side="positive"
        className={cn(
          chosen === "positive" && "bg-green-100 text-green-700",
        )}
        onClick={() => emit("positive")}
      >
        <ThumbsUp />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={downLabel}
        aria-pressed={chosen === "negative"}
        data-side="negative"
        className={cn(
          chosen === "negative" && "bg-red-100 text-red-700",
        )}
        onClick={() => emit("negative")}
      >
        <ThumbsDown />
      </Button>
    </div>
  );
}
