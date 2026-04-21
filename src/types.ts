// Shared type surface. Full structural shapes are intentionally loose —
// we narrow inside each block renderer rather than fighting the spec's
// optional-everywhere fields at the top level.

export type BlockSize = "sm" | "default" | "lg";

export type BlockType =
  | "section"
  | "divider"
  | "header"
  | "context"
  | "image"
  | "rich_text"
  | "actions"
  | "file"
  | "video"
  | "markdown"
  | "alert"
  | "input"
  | "context_actions"
  | "card"
  | "carousel"
  | "plan"
  | "task_card"
  | "table";

export interface BlockBase {
  type: BlockType | string;
  block_id?: string;
}

export type Block = BlockBase & Record<string, unknown>;

export interface PlainTextObject {
  type: "plain_text";
  text: string;
  emoji?: boolean;
}

export interface MrkdwnTextObject {
  type: "mrkdwn";
  text: string;
  /** When true, skip Slack-specific mrkdwn parsing — show the text literally. */
  verbatim?: boolean;
}

export type TextObject = PlainTextObject | MrkdwnTextObject;

export interface ImageElement {
  type: "image";
  image_url: string;
  alt_text: string;
}
