import type { ReactNode } from "react";
import { ButtonElement, type ButtonElementData } from "./button";
import {
  WorkflowButtonElement,
  type WorkflowButtonElementData,
} from "./workflow_button";
import {
  IconButtonElement,
  type IconButtonElementData,
} from "./icon_button";
import {
  FeedbackButtonsElement,
  type FeedbackButtonsElementData,
} from "./feedback_buttons";
import { SelectElement, type SelectElementData } from "./select";
import { ImageElementView } from "./image_element";
import type { ImageElement } from "../types";
import { isDev } from "../utils/env";

// Every block that can host an action or input element routes through
// here — actions, context, context_actions, input, section accessory.

type AnyElement = { type: string; [k: string]: unknown };

export function ElementDispatch({ element }: { element: AnyElement }): ReactNode {
  switch (element.type) {
    case "button":
      return <ButtonElement element={element as unknown as ButtonElementData} />;
    case "workflow_button":
      return (
        <WorkflowButtonElement
          element={element as unknown as WorkflowButtonElementData}
        />
      );
    case "icon_button":
      return (
        <IconButtonElement element={element as unknown as IconButtonElementData} />
      );
    case "feedback_buttons":
      return (
        <FeedbackButtonsElement
          element={element as unknown as FeedbackButtonsElementData}
        />
      );
    case "static_select":
    case "external_select":
    case "users_select":
    case "channels_select":
    case "conversations_select":
    case "multi_static_select":
    case "multi_external_select":
    case "multi_users_select":
    case "multi_channels_select":
    case "multi_conversations_select":
      return <SelectElement element={element as unknown as SelectElementData} />;
    case "image":
      return <ImageElementView element={element as unknown as ImageElement} />;
    default:
      if (isDev()) {
        // eslint-disable-next-line no-console
        console.warn(
          `[@tiers-io/slack-blocks-shadcn] unsupported element type: ${element.type}`,
        );
      }
      return null;
  }
}
