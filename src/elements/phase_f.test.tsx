import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "../message";
import type { Block } from "../types";

function wrap(element: Record<string, unknown>) {
  return (
    <Message
      size="default"
      blocks={[
        { type: "actions", elements: [element] },
      ] as Block[]}
    />
  );
}

describe("Phase F: input elements", () => {
  it("plain_text_input renders as disabled <input>", () => {
    render(wrap({ type: "plain_text_input", action_id: "n", initial_value: "hi" }));
    const el = document.querySelector('[data-element="plain_text_input"]') as HTMLInputElement;
    expect(el).toBeInTheDocument();
    expect(el).toBeDisabled();
    expect(el.value).toBe("hi");
  });

  it("plain_text_input multiline renders as <textarea>", () => {
    render(
      wrap({ type: "plain_text_input", action_id: "n", multiline: true, initial_value: "long" }),
    );
    expect(
      document.querySelector('textarea[data-element="plain_text_input"]'),
    ).toBeInTheDocument();
  });

  it.each([
    ["number_input", "number"],
    ["email_text_input", "email"],
    ["url_text_input", "url"],
  ])("%s disabled input has type %s", (elType, htmlType) => {
    render(wrap({ type: elType, action_id: "x" }));
    const el = document.querySelector(`[data-element="${elType}"]`) as HTMLInputElement;
    expect(el.type).toBe(htmlType);
    expect(el).toBeDisabled();
  });

  it("rich_text_input renders a disabled multi-line textarea", () => {
    render(wrap({ type: "rich_text_input", action_id: "x" }));
    const el = document.querySelector('textarea[data-element="rich_text_input"]');
    expect(el).toBeInTheDocument();
    expect(el).toBeDisabled();
  });

  it("datepicker shows initial_date label", () => {
    render(wrap({ type: "datepicker", action_id: "d", initial_date: "2026-04-21" }));
    expect(screen.getByText("2026-04-21")).toBeInTheDocument();
    expect(
      document.querySelector('[data-element="datepicker"]'),
    ).toBeDisabled();
  });

  it("timepicker shows initial_time label", () => {
    render(wrap({ type: "timepicker", action_id: "t", initial_time: "09:30" }));
    expect(screen.getByText("09:30")).toBeInTheDocument();
  });

  it("datetimepicker formats unix timestamp", () => {
    render(
      wrap({ type: "datetimepicker", action_id: "dt", initial_date_time: 1776240000 }),
    );
    expect(
      document.querySelector('[data-element="datetimepicker"]')!.textContent,
    ).toMatch(/2026-/);
  });

  it("checkboxes renders one row per option and marks selected", () => {
    render(
      wrap({
        type: "checkboxes",
        action_id: "c",
        options: [
          { text: { type: "plain_text", text: "A" }, value: "a" },
          { text: { type: "plain_text", text: "B" }, value: "b" },
        ],
        initial_options: [{ text: { type: "plain_text", text: "A" }, value: "a" }],
      }),
    );
    const rows = document.querySelectorAll('[data-element="checkboxes"] li');
    expect(rows).toHaveLength(2);
    expect(rows[0]!.getAttribute("data-checked")).toBe("true");
    expect(rows[1]!.getAttribute("data-checked")).toBe("false");
  });

  it("radio_buttons has role=radiogroup with one selected radio", () => {
    render(
      wrap({
        type: "radio_buttons",
        action_id: "r",
        options: [
          { text: { type: "plain_text", text: "One" }, value: "1" },
          { text: { type: "plain_text", text: "Two" }, value: "2" },
        ],
        initial_option: { text: { type: "plain_text", text: "Two" }, value: "2" },
      }),
    );
    const group = document.querySelector('[role="radiogroup"]')!;
    expect(group).toBeInTheDocument();
    const radios = group.querySelectorAll('[role="radio"]');
    expect(radios).toHaveLength(2);
    expect(radios[0]!.getAttribute("aria-checked")).toBe("false");
    expect(radios[1]!.getAttribute("aria-checked")).toBe("true");
  });

  it("overflow renders as disabled icon button with aria-label listing options", () => {
    render(
      wrap({
        type: "overflow",
        action_id: "o",
        options: [
          { text: { type: "plain_text", text: "Edit" }, value: "edit" },
          { text: { type: "plain_text", text: "Delete" }, value: "delete" },
        ],
      }),
    );
    const btn = document.querySelector('[data-element="overflow"]');
    expect(btn).toBeDisabled();
    expect(btn!.getAttribute("aria-label")).toContain("Edit, Delete");
  });

  it("file_input + url_source render disabled with their labels", () => {
    render(
      <Message
        size="default"
        blocks={[
          {
            type: "actions",
            elements: [
              { type: "file_input", action_id: "f", filetypes: ["pdf", "png"] },
              { type: "url_source", url: "https://example.com" },
            ],
          },
        ] as Block[]}
      />,
    );
    expect(document.querySelector('[data-element="file_input"]')).toBeDisabled();
    expect(screen.getByText("https://example.com")).toBeInTheDocument();
  });
});
