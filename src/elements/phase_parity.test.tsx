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

  it("rich_text emoji with compound unicode sequence renders the glyph", () => {
    render(
      <Message
        blocks={[
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "emoji",
                    name: "couple_with_heart",
                    unicode: "1f9d1-1f3fc-200d-2764-fe0f-200d-1f9d1-1f3fe",
                  },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const text = document.body.textContent || "";
    expect(text).not.toContain("1f9d1-1f3fc");
    expect(text).toMatch(/🧑|❤|💑/u);
  });

  it("rich_text emoji with skin_tone attaches Fitzpatrick modifier", () => {
    const { container } = render(
      <Message
        blocks={[
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [{ type: "emoji", name: "ok_hand", skin_tone: 2 }],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    expect(container.textContent).toContain("👌🏻");
  });

  it("rich_text ordered list uses native <ol> with list-style-type, so numbers don't leak into textContent", () => {
    const { container } = render(
      <Message
        blocks={[
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_list",
                style: "ordered",
                elements: [
                  { type: "rich_text_section", elements: [{ type: "text", text: "one" }] },
                  { type: "rich_text_section", elements: [{ type: "text", text: "two" }] },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const ol = container.querySelector("ol");
    expect(ol).not.toBeNull();
    // Slack renders list markers via the browser's ::marker — they must
    // NOT appear in the text content.
    expect(container.textContent).toBe("onetwo");
    expect(container.textContent).not.toMatch(/\d\./);
  });

  it("rich_text text with combined styles renders semantic tags (b > i > s > code)", () => {
    const { container } = render(
      <Message
        blocks={[
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [
                  {
                    type: "text",
                    text: "combo",
                    style: { bold: true, italic: true, strike: true, code: true },
                  },
                ],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    expect(container.querySelector("code")).not.toBeNull();
    expect(container.querySelector("code b")).not.toBeNull();
    expect(container.querySelector("code b i")).not.toBeNull();
    expect(container.querySelector("code b i s")).not.toBeNull();
    expect(container.querySelector("code b i s")!.textContent).toBe("combo");
  });

  it("mrkdwn combines `:emoji::skin-tone-N:` into glyph + Fitzpatrick modifier", () => {
    const { container } = render(
      <Message
        blocks={[
          {
            type: "section",
            text: { type: "mrkdwn", text: ":ok_hand::skin-tone-2:" },
          },
        ] as Block[]}
      />,
    );
    expect(container.textContent).toContain("👌🏻");
    expect(container.textContent).not.toContain(":skin-tone-2:");
  });

  it("rich_text emoji shortcode name 'thumbsup' resolves to 👍", () => {
    render(
      <Message
        blocks={[
          {
            type: "rich_text",
            elements: [
              {
                type: "rich_text_section",
                elements: [{ type: "emoji", name: "thumbsup" }],
              },
            ],
          },
        ] as Block[]}
      />,
    );
    expect(document.body.textContent).toContain("👍");
    expect(document.body.textContent).not.toContain(":thumbsup:");
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
