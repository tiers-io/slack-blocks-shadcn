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
import {
  PlainTextInput,
  NumberInput,
  EmailInput,
  UrlInput,
  RichTextInputElement,
  type PlainTextInputData,
  type NumberInputData,
  type EmailInputData,
  type UrlInputData,
  type RichTextInputData,
} from "./inputs";
import {
  Datepicker,
  Timepicker,
  Datetimepicker,
  type DatepickerData,
  type TimepickerData,
  type DatetimepickerData,
} from "./pickers";
import {
  Checkboxes,
  RadioButtons,
  type CheckboxesData,
  type RadioButtonsData,
} from "./choice";
import { OverflowMenu, type OverflowData } from "./overflow";
import {
  FileInputElement,
  UrlSourceElement,
  type FileInputData,
  type UrlSourceData,
} from "./file_input";

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
    case "plain_text_input":
      return <PlainTextInput element={element as unknown as PlainTextInputData} />;
    case "number_input":
      return <NumberInput element={element as unknown as NumberInputData} />;
    case "email_text_input":
      return <EmailInput element={element as unknown as EmailInputData} />;
    case "url_text_input":
      return <UrlInput element={element as unknown as UrlInputData} />;
    case "rich_text_input":
      return (
        <RichTextInputElement
          element={element as unknown as RichTextInputData}
        />
      );
    case "datepicker":
      return <Datepicker element={element as unknown as DatepickerData} />;
    case "timepicker":
      return <Timepicker element={element as unknown as TimepickerData} />;
    case "datetimepicker":
      return (
        <Datetimepicker element={element as unknown as DatetimepickerData} />
      );
    case "checkboxes":
      return <Checkboxes element={element as unknown as CheckboxesData} />;
    case "radio_buttons":
      return <RadioButtons element={element as unknown as RadioButtonsData} />;
    case "overflow":
      return <OverflowMenu element={element as unknown as OverflowData} />;
    case "file_input":
      return <FileInputElement element={element as unknown as FileInputData} />;
    case "url_source":
      return <UrlSourceElement element={element as unknown as UrlSourceData} />;
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
