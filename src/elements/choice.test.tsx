import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Message } from "../message";
import type { Block } from "../types";

describe("Phase O — interactive choice elements", () => {
  it("checkboxes: toggle fires onAction with cumulative selection", async () => {
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
                type: "checkboxes",
                action_id: "prefs",
                options: [
                  { text: { type: "plain_text", text: "Email" }, value: "email" },
                  { text: { type: "plain_text", text: "SMS" }, value: "sms" },
                  { text: { type: "plain_text", text: "Push" }, value: "push" },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("checkbox", { name: /Email/ }));
    expect(onAction).toHaveBeenLastCalledWith({
      type: "checkboxes",
      action_id: "prefs",
      selected_options: [{ value: "email", text: "Email" }],
    });
    await user.click(screen.getByRole("checkbox", { name: /Push/ }));
    expect(onAction).toHaveBeenLastCalledWith({
      type: "checkboxes",
      action_id: "prefs",
      selected_options: [
        { value: "email", text: "Email" },
        { value: "push", text: "Push" },
      ],
    });
    // click Email again → deselects
    await user.click(screen.getByRole("checkbox", { name: /Email/ }));
    expect(onAction).toHaveBeenLastCalledWith({
      type: "checkboxes",
      action_id: "prefs",
      selected_options: [{ value: "push", text: "Push" }],
    });
  });

  it("radio_buttons: picking fires onAction with the single selection", async () => {
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
                type: "radio_buttons",
                action_id: "severity",
                options: [
                  { text: { type: "plain_text", text: "Low" }, value: "low" },
                  { text: { type: "plain_text", text: "High" }, value: "high" },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("radio", { name: /High/ }));
    expect(onAction).toHaveBeenCalledWith({
      type: "radio_buttons",
      action_id: "severity",
      selected_option: { value: "high", text: "High" },
    });
  });

  it("overflow: url option navigates via window.open; value option emits onAction", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    const originalOpen = window.open;
    const openSpy = vi.fn().mockReturnValue(null);
    window.open = openSpy as unknown as typeof window.open;
    render(
      <Message
        onAction={onAction}
        blocks={[
          {
            type: "actions",
            elements: [
              {
                type: "overflow",
                action_id: "row",
                options: [
                  {
                    text: { type: "plain_text", text: "Open external" },
                    value: "ext",
                    url: "https://example.com/row/42",
                  },
                  {
                    text: { type: "plain_text", text: "Delete" },
                    value: "delete",
                  },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Overflow menu" }));
    await user.click(screen.getByText("Open external"));
    expect(openSpy).toHaveBeenCalledWith(
      "https://example.com/row/42",
      "_blank",
      "noopener,noreferrer",
    );
    expect(onAction).not.toHaveBeenCalled();

    // Re-open and pick the delete option (no url)
    await user.click(screen.getByRole("button", { name: "Overflow menu" }));
    await user.click(screen.getByText("Delete"));
    expect(onAction).toHaveBeenCalledWith({
      type: "overflow",
      action_id: "row",
      selected_option: { value: "delete", text: "Delete" },
    });

    window.open = originalOpen;
  });

  it("rich_text_input: typing then blurring emits mrkdwn value", async () => {
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
                type: "rich_text_input",
                action_id: "note",
                initial_value: "",
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const ta = document.querySelector(
      'textarea[data-element="rich_text_input"]',
    ) as HTMLTextAreaElement;
    await user.type(ta, "hello *world*");
    ta.blur();
    expect(onAction).toHaveBeenCalledWith({
      type: "rich_text_input",
      action_id: "note",
      value: "hello *world*",
    });
  });
});
