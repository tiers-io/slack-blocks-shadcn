import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useOnAction } from "../components-registry";

// Text inputs emit onAction on blur (default) or per-keystroke when the
// consumer opts in via dispatch_action_config.

type Common = {
  action_id: string;
  placeholder?: { text: string };
  initial_value?: string;
  focus_on_load?: boolean;
};

export interface DispatchActionConfig {
  /** Upstream: ["on_enter_pressed", "on_character_entered"] */
  trigger_actions_on?: ("on_enter_pressed" | "on_character_entered")[];
}

export interface PlainTextInputData extends Common {
  type: "plain_text_input";
  multiline?: boolean;
  min_length?: number;
  max_length?: number;
  dispatch_action_config?: DispatchActionConfig;
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
  const onAction = useOnAction();
  const [value, setValue] = useState(element.initial_value ?? "");
  const placeholder = element.placeholder?.text ?? "";
  const triggers = element.dispatch_action_config?.trigger_actions_on ?? [];
  const emitOnChar = triggers.includes("on_character_entered");
  const emitOnEnter = triggers.includes("on_enter_pressed");

  const emit = (v: string) => {
    onAction?.({
      type: "plain_text_input",
      action_id: element.action_id,
      value: v,
    });
  };

  const common = {
    "data-element": "plain_text_input",
    placeholder,
    value,
    minLength: element.min_length,
    maxLength: element.max_length,
    autoFocus: element.focus_on_load,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValue(e.target.value);
      if (emitOnChar) emit(e.target.value);
    },
    onBlur: () => emit(value),
    onKeyDown: (e: React.KeyboardEvent) => {
      if (emitOnEnter && e.key === "Enter" && !e.shiftKey) {
        if (!element.multiline) e.preventDefault();
        emit(value);
      }
    },
  };

  if (element.multiline) {
    return <Textarea {...common} />;
  }
  return <Input {...common} />;
}

export function NumberInput({ element }: { element: NumberInputData }) {
  const onAction = useOnAction();
  const [value, setValue] = useState(element.initial_value ?? "");
  return (
    <Input
      type="number"
      data-element="number_input"
      placeholder={element.placeholder?.text}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() =>
        onAction?.({
          type: "number_input",
          action_id: element.action_id,
          value,
        })
      }
      min={element.min_value}
      max={element.max_value}
      step={element.is_decimal_allowed ? "any" : "1"}
      autoFocus={element.focus_on_load}
    />
  );
}

export function EmailInput({ element }: { element: EmailInputData }) {
  const onAction = useOnAction();
  const [value, setValue] = useState(element.initial_value ?? "");
  return (
    <Input
      type="email"
      data-element="email_text_input"
      placeholder={element.placeholder?.text}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() =>
        onAction?.({
          type: "email_text_input",
          action_id: element.action_id,
          value,
        })
      }
      autoFocus={element.focus_on_load}
    />
  );
}

export function UrlInput({ element }: { element: UrlInputData }) {
  const onAction = useOnAction();
  const [value, setValue] = useState(element.initial_value ?? "");
  return (
    <Input
      type="url"
      data-element="url_text_input"
      placeholder={element.placeholder?.text}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() =>
        onAction?.({
          type: "url_text_input",
          action_id: element.action_id,
          value,
        })
      }
      autoFocus={element.focus_on_load}
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
