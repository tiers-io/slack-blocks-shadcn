import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Message } from "../message";
import type { Block } from "../types";

describe("Post-real-Slack parity fixes", () => {
  it("plain_text with emoji:true resolves :shortcode: into unicode glyphs", () => {
    render(
      <Message
        blocks={[
          {
            type: "header",
            text: {
              type: "plain_text",
              text: ":newspaper: Paper Company",
              emoji: true,
            },
          },
        ] as Block[]}
      />,
    );
    const header = screen.getByRole("heading");
    expect(header.textContent).toContain("📰");
    expect(header.textContent).not.toContain(":newspaper:");
  });

  it("plain_text with emoji:false leaves shortcodes as-is", () => {
    render(
      <Message
        blocks={[
          {
            type: "header",
            text: {
              type: "plain_text",
              text: ":newspaper: Paper Company",
              emoji: false,
            },
          },
        ] as Block[]}
      />,
    );
    expect(screen.getByRole("heading").textContent).toContain(":newspaper:");
  });

  it("button is interactive and fires onAction with action_id + value", async () => {
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
                type: "button",
                action_id: "approve",
                text: { type: "plain_text", text: "Approve" },
                value: "yes",
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const btn = screen.getByRole("button", { name: /Approve/ });
    expect(btn).not.toBeDisabled();
    await user.click(btn);
    expect(onAction).toHaveBeenCalledWith({
      type: "button",
      action_id: "approve",
      value: "yes",
    });
  });

  it("card renders body alongside hero_image (not one-or-the-other)", () => {
    const { container } = render(
      <Message
        blocks={[
          {
            type: "card",
            hero_image: {
              type: "image",
              image_url: "https://x/hero.png",
              alt_text: "Hero",
            },
            body: {
              type: "mrkdwn",
              text: "Photo by John Google",
            },
          },
        ] as Block[]}
      />,
    );
    expect(container.querySelector("img")).toBeInTheDocument();
    expect(screen.getByText(/Photo by John Google/)).toBeInTheDocument();
  });

  it("card still accepts body as an array (existing callers)", () => {
    render(
      <Message
        blocks={[
          {
            type: "card",
            body: [
              { type: "mrkdwn", text: "First paragraph" },
              { type: "mrkdwn", text: "Second paragraph" },
            ],
          },
        ] as Block[]}
      />,
    );
    expect(screen.getByText(/First paragraph/)).toBeInTheDocument();
    expect(screen.getByText(/Second paragraph/)).toBeInTheDocument();
  });
});
