// Rich text shape is deeply nested. Keeping it local to blocks/rich_text/
// so the public `types.ts` stays light — consumers don't need these unless
// they're authoring renderers.

export interface RichTextStyle {
  bold?: boolean;
  italic?: boolean;
  strike?: boolean;
  underline?: boolean;
  code?: boolean;
  /** Mention-only: renders with a highlighted background (Slack's search-highlight semantics). */
  highlight?: boolean;
  /** Mention-only: client-side search highlight (tiers-native styling). */
  client_highlight?: boolean;
  /** Link-only: render the text but disable the href. */
  unlink?: boolean;
}

export interface RichTextText {
  type: "text";
  text: string;
  style?: RichTextStyle;
}

export interface RichTextLink {
  type: "link";
  url: string;
  text?: string;
  style?: RichTextStyle;
  unsafe?: boolean;
}

export interface RichTextEmoji {
  type: "emoji";
  name: string;
  unicode?: string;
  skin_tone?: number;
}

export interface RichTextUser {
  type: "user";
  user_id: string;
  style?: RichTextStyle;
}

export interface RichTextChannel {
  type: "channel";
  channel_id: string;
  style?: RichTextStyle;
}

export interface RichTextUsergroup {
  type: "usergroup";
  usergroup_id: string;
  style?: RichTextStyle;
}

export interface RichTextBroadcast {
  type: "broadcast";
  range: "here" | "channel" | "everyone";
  style?: RichTextStyle;
}

export interface RichTextDate {
  type: "date";
  timestamp: number | string;
  format?: string;
  url?: string;
  fallback?: string;
  style?: RichTextStyle;
}

export interface RichTextColor {
  type: "color";
  value: string;
}

export type RichTextInlineElement =
  | RichTextText
  | RichTextLink
  | RichTextEmoji
  | RichTextUser
  | RichTextChannel
  | RichTextUsergroup
  | RichTextBroadcast
  | RichTextDate
  | RichTextColor;

export interface RichTextSectionElement {
  type: "rich_text_section";
  elements: RichTextInlineElement[];
}

export interface RichTextListElement {
  type: "rich_text_list";
  style: "bullet" | "ordered";
  indent?: number;
  offset?: number;
  border?: number;
  elements: RichTextSectionElement[];
}

export interface RichTextQuoteElement {
  type: "rich_text_quote";
  elements: RichTextInlineElement[];
}

export interface RichTextPreformattedElement {
  type: "rich_text_preformatted";
  border?: number;
  elements: (RichTextText | RichTextLink)[];
}

export type RichTextSubBlock =
  | RichTextSectionElement
  | RichTextListElement
  | RichTextQuoteElement
  | RichTextPreformattedElement;

export interface RichTextBlockData {
  type: "rich_text";
  block_id?: string;
  elements: RichTextSubBlock[];
}
