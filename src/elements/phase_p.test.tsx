import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Message } from "../message";
import type { Block } from "../types";

describe("Phase P — final parity", () => {
  it("feedback_buttons: click positive emits up; click negative emits down", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "feedback_buttons",
                action_id: "rate",
                positive_button: { accessibility_label: "Helpful", value: "yes" },
                negative_button: { accessibility_label: "Unhelpful", value: "no" },
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Helpful" }));
    expect(onAction).toHaveBeenLastCalledWith({
      type: "feedback_buttons",
      action_id: "rate",
      value: "up",
      payload_value: "yes",
    });
    await user.click(screen.getByRole("button", { name: "Unhelpful" }));
    expect(onAction).toHaveBeenLastCalledWith({
      type: "feedback_buttons",
      action_id: "rate",
      value: "down",
      payload_value: "no",
    });
  });

  it("plain_text_input: type + blur emits the final value", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "plain_text_input",
                action_id: "name",
                placeholder: { text: "Your name" },
                max_length: 20,
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const input = document.querySelector(
      'input[data-element="plain_text_input"]',
    ) as HTMLInputElement;
    expect(input.maxLength).toBe(20);
    await user.type(input, "Brandon");
    input.blur();
    expect(onAction).toHaveBeenLastCalledWith({
      type: "plain_text_input",
      action_id: "name",
      value: "Brandon",
    });
  });

  it("plain_text_input: dispatch on_character_entered emits per keystroke", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "plain_text_input",
                action_id: "live",
                dispatch_action_config: {
                  trigger_actions_on: ["on_character_entered"],
                },
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const input = document.querySelector(
      'input[data-element="plain_text_input"]',
    ) as HTMLInputElement;
    await user.type(input, "abc");
    // 3 characters → 3 calls
    expect(onAction).toHaveBeenCalledTimes(3);
    expect(onAction).toHaveBeenLastCalledWith({
      type: "plain_text_input",
      action_id: "live",
      value: "abc",
    });
  });

  it("file_input: picking a file emits serializable file metadata", async () => {
    const onAction = vi.fn();
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "file_input",
                action_id: "upload",
                filetypes: ["pdf"],
                max_files: 1,
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const hidden = document.querySelector(
      '[data-element="file_input_hidden"]',
    ) as HTMLInputElement;
    const file = new File(["%PDF-1.4"], "spec.pdf", {
      type: "application/pdf",
    });
    const user = userEvent.setup();
    await user.upload(hidden, file);
    expect(onAction).toHaveBeenCalledWith({
      type: "file_input",
      action_id: "upload",
      files: [{ name: "spec.pdf", size: file.size, type: "application/pdf" }],
    });
  });
});
