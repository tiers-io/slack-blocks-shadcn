import type { ReactNode } from "react";
import { isDev } from "../utils/env";
import { useComponent, type ComponentOverrides } from "../components-registry";

// Element router. Every element type maps to one slot in the registry
// so consumers can swap individual elements without touching the rest.

type AnyElement = { type: string; [k: string]: unknown };

const ELEMENT_KEY: Record<string, keyof ComponentOverrides> = {
  button: "ButtonElement",
  workflow_button: "WorkflowButtonElement",
  icon_button: "IconButtonElement",
  feedback_buttons: "FeedbackButtonsElement",
  static_select: "StaticSelectElement",
  external_select: "ExternalSelectElement",
  users_select: "UsersSelectElement",
  channels_select: "ChannelsSelectElement",
  conversations_select: "ConversationsSelectElement",
  multi_static_select: "MultiStaticSelectElement",
  multi_external_select: "MultiExternalSelectElement",
  multi_users_select: "MultiUsersSelectElement",
  multi_channels_select: "MultiChannelsSelectElement",
  multi_conversations_select: "MultiConversationsSelectElement",
  image: "ImageElementView",
  plain_text_input: "PlainTextInput",
  number_input: "NumberInput",
  email_text_input: "EmailInput",
  url_text_input: "UrlInput",
  rich_text_input: "RichTextInputElement",
  datepicker: "Datepicker",
  timepicker: "Timepicker",
  datetimepicker: "Datetimepicker",
  checkboxes: "Checkboxes",
  radio_buttons: "RadioButtons",
  overflow: "OverflowMenu",
  file_input: "FileInputElement",
  url_source: "UrlSourceElement",
};

export function ElementDispatch({ element }: { element: AnyElement }): ReactNode {
  const key = ELEMENT_KEY[element.type];
  const Component = useComponent(
    key ?? ("ButtonElement" as keyof ComponentOverrides),
  );
  if (!key) {
    if (isDev()) {
      // eslint-disable-next-line no-console
      console.warn(
        `[@tiers-io/slack-blocks-shadcn] unsupported element type: ${element.type}`,
      );
    }
    return null;
  }
  // Registry entries all accept `{ element }` — cast away the narrow
  // union since ELEMENT_KEY covers every supported runtime type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const C = Component as any;
  return <C element={element} />;
}
