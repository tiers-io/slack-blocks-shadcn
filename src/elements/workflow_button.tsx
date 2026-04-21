import { ButtonElement, type ButtonElementData } from "./button";
import type { PlainTextObject } from "../types";

// Workflow buttons render like regular buttons; their distinguishing
// feature is a bound workflow object that we don't round-trip from a
// viewer. Delegate to ButtonElement with the same visual contract.

export interface WorkflowButtonElementData {
  type: "workflow_button";
  action_id: string;
  text: PlainTextObject;
  workflow: { trigger: { url: string } };
  style?: "primary" | "danger";
  accessibility_label?: string;
}

export function WorkflowButtonElement({
  element,
}: {
  element: WorkflowButtonElementData;
}) {
  const bridged: ButtonElementData = {
    type: "button",
    action_id: element.action_id,
    text: element.text,
    url: element.workflow.trigger.url,
    style: element.style,
    accessibility_label: element.accessibility_label,
  };
  return <ButtonElement element={bridged} />;
}
