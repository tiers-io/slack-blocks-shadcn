import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useOnAction } from "../components-registry";

// The five text-ish inputs. All render disabled — we surface the initial
// value (or placeholder) so the Slack message is still legible without
// interaction.

type Common = {
  action_id: string;
  placeholder?: { text: string };
  initial_value?: string;
  focus_on_load?: boolean;
};

export interface PlainTextInputData extends Common {
  type: "plain_text_input";
  multiline?: boolean;
  min_length?: number;
  max_length?: number;
}
export interface NumberInputData extends Common {
  type: "number_input";
  is_decimal_allowed?: boolean;
  min_value?: string;
  max_value?: string;
}
export interface EmailInputData extends Common {
  type: "email_text_input";
}
export interface UrlInputData extends Common {
  type: "url_text_input";
}
export interface RichTextInputData extends Common {
  type: "rich_text_input";
}

export function PlainTextInput({ element }: { element: PlainTextInputData }) {
  const placeholder = element.placeholder?.text ?? "";
  if (element.multiline) {
    return (
      <Textarea
        disabled
        data-element="plain_text_input"
        aria-disabled="true"
        placeholder={placeholder}
        defaultValue={element.initial_value}
      />
    );
  }
  return (
    <Input
      disabled
      data-element="plain_text_input"
      aria-disabled="true"
      placeholder={placeholder}
      defaultValue={element.initial_value}
    />
  );
}

export function NumberInput({ element }: { element: NumberInputData }) {
  return (
    <Input
      type="number"
      disabled
      data-element="number_input"
      aria-disabled="true"
      placeholder={element.placeholder?.text}
      defaultValue={element.initial_value}
      step={element.is_decimal_allowed ? "any" : "1"}
    />
  );
}

export function EmailInput({ element }: { element: EmailInputData }) {
  return (
    <Input
      type="email"
      disabled
      data-element="email_text_input"
      aria-disabled="true"
      placeholder={element.placeholder?.text}
      defaultValue={element.initial_value}
    />
  );
}

export function UrlInput({ element }: { element: UrlInputData }) {
  return (
    <Input
      type="url"
      disabled
      data-element="url_text_input"
      aria-disabled="true"
      placeholder={element.placeholder?.text}
      defaultValue={element.initial_value}
    />
  );
}

export function RichTextInputElement({
  element,
}: {
  element: RichTextInputData;
}) {
  // Upstream ships a lightweight rich-text editor. We use a shadcn
  // `<Textarea>` with mrkdwn emission; a Tiptap-backed WYSIWYG is a
  // separate follow-up (tracked in the plan file). Editing fires
  // `onAction` on blur with the raw mrkdwn value.
  const onAction = useOnAction();
  const [value, setValue] = useState(element.initial_value ?? "");
  return (
    <Textarea
      data-element="rich_text_input"
      placeholder={element.placeholder?.text ?? "Write…"}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        onAction?.({
          type: "rich_text_input",
          action_id: element.action_id,
          value,
        });
      }}
      rows={3}
    />
  );
}
