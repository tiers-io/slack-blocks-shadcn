import { createContext, useContext, type ComponentType } from "react";

// Every block, element, and composition primitive the library ships is
// a slot that consumers can override from the <Message> call site. The
// registry is populated with `DEFAULT_COMPONENTS` at module load; the
// Message component merges consumer overrides on top and publishes the
// resolved set via ComponentsContext. `useComponent(key)` reads it.
//
// This sits alongside `Hooks` (which rewires specific render *functions*
// — user/channel/link/emoji/date mention helpers) and `Data` (pre-
// resolved mention data). Hooks handle the fine-grained case;
// `components` handles the whole-component swap.

import type { ReactNode } from "react";

import type { MessageProps as _RootMsgProps } from "./message";

import { SectionBlock, type SectionBlockData } from "./blocks/section";
import { DividerBlock } from "./blocks/divider";
import { HeaderBlock, type HeaderBlockData } from "./blocks/header";
import { ContextBlock, type ContextBlockData } from "./blocks/context";
import { ImageBlock, type ImageBlockData } from "./blocks/image";
import { RichTextBlock } from "./blocks/rich_text";
import type { RichTextBlockData } from "./blocks/rich_text/types";
import { ActionsBlock, type ActionsBlockData } from "./blocks/actions";
import { FileBlock, type FileBlockData } from "./blocks/file";
import { VideoBlock, type VideoBlockData } from "./blocks/video";
import { MarkdownBlock, type MarkdownBlockData } from "./blocks/markdown";
import { AlertBlock, type AlertBlockData } from "./blocks/alert";
import { InputBlock, type InputBlockData } from "./blocks/input";
import { ContextActionsBlock, type ContextActionsBlockData } from "./blocks/context_actions";
import { CardBlock, type CardBlockData } from "./blocks/card";
import { CarouselBlock, type CarouselBlockData } from "./blocks/carousel";
import { PlanBlock, type PlanBlockData } from "./blocks/plan";
import { TaskCardBlock, type TaskCardBlockData } from "./blocks/task_card";
import { TableBlock, type TableBlockData } from "./blocks/table";

import { ButtonElement, type ButtonElementData } from "./elements/button";
import { WorkflowButtonElement, type WorkflowButtonElementData } from "./elements/workflow_button";
import { IconButtonElement, type IconButtonElementData } from "./elements/icon_button";
import { FeedbackButtonsElement, type FeedbackButtonsElementData } from "./elements/feedback_buttons";
import {
  StaticSelectElement,
  MultiStaticSelectElement,
  UsersSelectElement,
  MultiUsersSelectElement,
  ChannelsSelectElement,
  MultiChannelsSelectElement,
  ConversationsSelectElement,
  MultiConversationsSelectElement,
  ExternalSelectElement,
  MultiExternalSelectElement,
  type StaticSelectData,
  type MultiStaticSelectData,
  type UsersSelectData,
  type MultiUsersSelectData,
  type ChannelsSelectData,
  type MultiChannelsSelectData,
  type ConversationsSelectData,
  type MultiConversationsSelectData,
  type ExternalSelectData,
  type MultiExternalSelectData,
} from "./elements/select";
import { ImageElementView } from "./elements/image_element";
import type { ImageElement } from "./types";
import {
  PlainTextInput, NumberInput, EmailInput, UrlInput, RichTextInputElement,
  type PlainTextInputData, type NumberInputData, type EmailInputData,
  type UrlInputData, type RichTextInputData,
} from "./elements/inputs";
import {
  Datepicker, Timepicker, Datetimepicker,
  type DatepickerData, type TimepickerData, type DatetimepickerData,
} from "./elements/pickers";
import {
  Checkboxes, RadioButtons, type CheckboxesData, type RadioButtonsData,
} from "./elements/choice";
import { OverflowMenu, type OverflowData } from "./elements/overflow";
import {
  FileInputElement, UrlSourceElement, type FileInputData, type UrlSourceData,
} from "./elements/file_input";

import { MentionPill, type MentionPillProps } from "./composition/MentionPill";
import { InlineLink, type InlineLinkProps } from "./composition/InlineLink";
import { RenderTextObject, type TextObjectProps } from "./composition/TextObject";
import { ConfirmDialog, type ConfirmDialogProps } from "./composition/ConfirmDialog";

/** Every slot consumers can swap. Props match the default implementation. */
export interface ComponentOverrides {
  // Blocks (19)
  SectionBlock: ComponentType<{ block: SectionBlockData }>;
  DividerBlock: ComponentType;
  HeaderBlock: ComponentType<{ block: HeaderBlockData }>;
  ContextBlock: ComponentType<{ block: ContextBlockData }>;
  ImageBlock: ComponentType<{ block: ImageBlockData }>;
  RichTextBlock: ComponentType<{ block: RichTextBlockData }>;
  ActionsBlock: ComponentType<{ block: ActionsBlockData }>;
  ContextActionsBlock: ComponentType<{ block: ContextActionsBlockData }>;
  FileBlock: ComponentType<{ block: FileBlockData }>;
  VideoBlock: ComponentType<{ block: VideoBlockData }>;
  MarkdownBlock: ComponentType<{ block: MarkdownBlockData }>;
  AlertBlock: ComponentType<{ block: AlertBlockData }>;
  InputBlock: ComponentType<{ block: InputBlockData }>;
  CardBlock: ComponentType<{ block: CardBlockData }>;
  CarouselBlock: ComponentType<{ block: CarouselBlockData }>;
  PlanBlock: ComponentType<{ block: PlanBlockData }>;
  TaskCardBlock: ComponentType<{ block: TaskCardBlockData }>;
  TableBlock: ComponentType<{ block: TableBlockData }>;

  // Elements (23)
  ButtonElement: ComponentType<{ element: ButtonElementData }>;
  WorkflowButtonElement: ComponentType<{ element: WorkflowButtonElementData }>;
  IconButtonElement: ComponentType<{ element: IconButtonElementData }>;
  FeedbackButtonsElement: ComponentType<{ element: FeedbackButtonsElementData }>;
  StaticSelectElement: ComponentType<{ element: StaticSelectData }>;
  MultiStaticSelectElement: ComponentType<{ element: MultiStaticSelectData }>;
  UsersSelectElement: ComponentType<{ element: UsersSelectData }>;
  MultiUsersSelectElement: ComponentType<{ element: MultiUsersSelectData }>;
  ChannelsSelectElement: ComponentType<{ element: ChannelsSelectData }>;
  MultiChannelsSelectElement: ComponentType<{ element: MultiChannelsSelectData }>;
  ConversationsSelectElement: ComponentType<{ element: ConversationsSelectData }>;
  MultiConversationsSelectElement: ComponentType<{ element: MultiConversationsSelectData }>;
  ExternalSelectElement: ComponentType<{ element: ExternalSelectData }>;
  MultiExternalSelectElement: ComponentType<{ element: MultiExternalSelectData }>;
  ImageElementView: ComponentType<{ element: ImageElement }>;
  PlainTextInput: ComponentType<{ element: PlainTextInputData }>;
  NumberInput: ComponentType<{ element: NumberInputData }>;
  EmailInput: ComponentType<{ element: EmailInputData }>;
  UrlInput: ComponentType<{ element: UrlInputData }>;
  RichTextInputElement: ComponentType<{ element: RichTextInputData }>;
  Datepicker: ComponentType<{ element: DatepickerData }>;
  Timepicker: ComponentType<{ element: TimepickerData }>;
  Datetimepicker: ComponentType<{ element: DatetimepickerData }>;
  Checkboxes: ComponentType<{ element: CheckboxesData }>;
  RadioButtons: ComponentType<{ element: RadioButtonsData }>;
  OverflowMenu: ComponentType<{ element: OverflowData }>;
  FileInputElement: ComponentType<{ element: FileInputData }>;
  UrlSourceElement: ComponentType<{ element: UrlSourceData }>;

  // Composition (4)
  MentionPill: ComponentType<MentionPillProps>;
  InlineLink: ComponentType<InlineLinkProps>;
  TextObject: ComponentType<TextObjectProps>;
  ConfirmDialog: ComponentType<ConfirmDialogProps>;
}

export const DEFAULT_COMPONENTS: ComponentOverrides = {
  SectionBlock,
  DividerBlock,
  HeaderBlock,
  ContextBlock,
  ImageBlock,
  RichTextBlock,
  ActionsBlock,
  ContextActionsBlock,
  FileBlock,
  VideoBlock,
  MarkdownBlock,
  AlertBlock,
  InputBlock,
  CardBlock,
  CarouselBlock,
  PlanBlock,
  TaskCardBlock,
  TableBlock,

  ButtonElement,
  WorkflowButtonElement,
  IconButtonElement,
  FeedbackButtonsElement,
  StaticSelectElement,
  MultiStaticSelectElement,
  UsersSelectElement,
  MultiUsersSelectElement,
  ChannelsSelectElement,
  MultiChannelsSelectElement,
  ConversationsSelectElement,
  MultiConversationsSelectElement,
  ExternalSelectElement,
  MultiExternalSelectElement,
  ImageElementView,
  PlainTextInput,
  NumberInput,
  EmailInput,
  UrlInput,
  RichTextInputElement,
  Datepicker,
  Timepicker,
  Datetimepicker,
  Checkboxes,
  RadioButtons,
  OverflowMenu,
  FileInputElement,
  UrlSourceElement,

  MentionPill,
  InlineLink,
  TextObject: RenderTextObject,
  ConfirmDialog,
};

export const ComponentsContext =
  createContext<ComponentOverrides>(DEFAULT_COMPONENTS);

export function useComponent<K extends keyof ComponentOverrides>(
  key: K,
): ComponentOverrides[K] {
  const registry = useContext(ComponentsContext);
  return registry[key] ?? DEFAULT_COMPONENTS[key];
}

/**
 * Discriminated payload emitted by `onAction`. Every interactive
 * element feeds into one of these variants. Consumers handle (or
 * ignore) specific types.
 */
export type ActionPayload =
  | { type: "button"; action_id?: string; value?: string }
  | { type: "workflow_button"; action_id: string; url: string }
  | { type: "icon_button"; action_id: string }
  | { type: "feedback_buttons"; action_id: string; value: "up" | "down" | "agree" | "disagree" | "good" | "bad" }
  | { type: "static_select"; action_id: string; selected_option: { value: string; text: string } | null }
  | { type: "multi_static_select"; action_id: string; selected_options: { value: string; text: string }[] }
  | { type: "users_select"; action_id: string; selected_user: string | null }
  | { type: "multi_users_select"; action_id: string; selected_users: string[] }
  | { type: "channels_select"; action_id: string; selected_channel: string | null }
  | { type: "multi_channels_select"; action_id: string; selected_channels: string[] }
  | { type: "conversations_select"; action_id: string; selected_conversation: string | null }
  | { type: "multi_conversations_select"; action_id: string; selected_conversations: string[] }
  | { type: "external_select"; action_id: string; selected_option: { value: string; text: string } | null }
  | { type: "multi_external_select"; action_id: string; selected_options: { value: string; text: string }[] }
  | { type: "datepicker"; action_id: string; selected_date: string }
  | { type: "timepicker"; action_id: string; selected_time: string }
  | { type: "datetimepicker"; action_id: string; selected_date_time: number }
  | { type: "checkboxes"; action_id: string; selected_options: { value: string; text: string }[] }
  | { type: "radio_buttons"; action_id: string; selected_option: { value: string; text: string } | null }
  | { type: "overflow"; action_id: string; selected_option: { value: string; text: string } }
  | { type: "plain_text_input"; action_id: string; value: string }
  | { type: "number_input"; action_id: string; value: string }
  | { type: "email_text_input"; action_id: string; value: string }
  | { type: "url_text_input"; action_id: string; value: string }
  | { type: "rich_text_input"; action_id: string; value: string }
  | { type: "file_input"; action_id: string; files: File[] };

export type OnActionCallback = (payload: ActionPayload) => void;

const OnActionContext = createContext<OnActionCallback | undefined>(undefined);

export function OnActionProvider({
  value,
  children,
}: {
  value: OnActionCallback | undefined;
  children: ReactNode;
}) {
  return (
    <OnActionContext.Provider value={value}>{children}</OnActionContext.Provider>
  );
}

export function useOnAction(): OnActionCallback | undefined {
  return useContext(OnActionContext);
}
