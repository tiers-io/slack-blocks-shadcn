import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "../../message";
import mixed from "../../../fixtures/rich-text-mixed.json";
import type { Block } from "../../types";

function renderBlocks(blocks: unknown[]) {
  return render(<Message blocks={blocks as Block[]} size="default" />);
}

describe("rich_text", () => {
  it("renders section paragraph with inline styles + mention + link", () => {
    renderBlocks(mixed);
    expect(document.querySelector('[data-block="rich_text"]')).toBeInTheDocument();
    expect(
      document.querySelector('[data-rich-text="section"]'),
    ).toBeInTheDocument();
    const green = screen.getByText("Everything green");
    // Semantic tags: bold wraps italic wraps text → inner = <i>
    expect(green.tagName).toBe("I");
    expect(green.closest("b")).not.toBeNull();
    const link = screen.getByText("view build");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("https://ci.example/build/4821");
  });

  it("renders a bullet list with three items", () => {
    renderBlocks(mixed);
    const wrapper = document.querySelector(
      '[data-rich-text="list"][data-style="bullet"]',
    );
    expect(wrapper).toBeInTheDocument();
    expect(wrapper!.querySelector("ul")).toBeInTheDocument();
    expect(wrapper!.querySelectorAll("li")).toHaveLength(3);
  });

  it("renders a quote with a broadcast pill", () => {
    renderBlocks(mixed);
    const quote = document.querySelector('[data-rich-text="quote"]');
    expect(quote).toBeInTheDocument();
    expect(quote!.tagName).toBe("BLOCKQUOTE");
    expect(
      quote!.querySelector('[data-variant="broadcast"]'),
    ).toBeInTheDocument();
  });

  it("renders preformatted code as <code><pre>", () => {
    renderBlocks(mixed);
    const wrapper = document.querySelector('[data-rich-text="preformatted"]');
    expect(wrapper).toBeInTheDocument();
    expect(wrapper!.tagName).toBe("CODE");
    const pre = wrapper!.querySelector("pre");
    expect(pre).toBeInTheDocument();
    expect(pre!.textContent).toContain("curl");
  });

  it("handles an ordered list", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_list",
            style: "ordered",
            elements: [
              { type: "rich_text_section", elements: [{ type: "text", text: "first" }] },
              { type: "rich_text_section", elements: [{ type: "text", text: "second" }] },
            ],
          },
        ],
      },
    ] as Block[]);
    const wrapper = document.querySelector(
      '[data-rich-text="list"][data-style="ordered"]',
    );
    expect(wrapper!.querySelector("ol")).toBeInTheDocument();
    expect(wrapper!.querySelectorAll("li")).toHaveLength(2);
  });

  it("renders ordered list markers — decimal at indent 0, alpha at 1, Roman at 2", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_list",
            style: "ordered",
            indent: 0,
            elements: [
              { type: "rich_text_section", elements: [{ type: "text", text: "one" }] },
              { type: "rich_text_section", elements: [{ type: "text", text: "two" }] },
            ],
          },
          {
            type: "rich_text_list",
            style: "ordered",
            indent: 1,
            elements: [
              { type: "rich_text_section", elements: [{ type: "text", text: "a" }] },
              { type: "rich_text_section", elements: [{ type: "text", text: "b" }] },
            ],
          },
          {
            type: "rich_text_list",
            style: "ordered",
            indent: 2,
            elements: [
              { type: "rich_text_section", elements: [{ type: "text", text: "i" }] },
              { type: "rich_text_section", elements: [{ type: "text", text: "ii" }] },
            ],
          },
        ],
      },
    ] as Block[]);
    const ols = Array.from(
      document.querySelectorAll('[data-rich-text="list"][data-style="ordered"] ol'),
    ) as HTMLOListElement[];
    expect(ols).toHaveLength(3);
    expect(ols[0]!.style.listStyleType).toBe("decimal");
    expect(ols[1]!.style.listStyleType).toBe("lower-alpha");
    expect(ols[2]!.style.listStyleType).toBe("lower-roman");
  });

  it("honours list offset (starts ordered counting at offset+1)", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_list",
            style: "ordered",
            offset: 4,
            elements: [
              { type: "rich_text_section", elements: [{ type: "text", text: "a" }] },
              { type: "rich_text_section", elements: [{ type: "text", text: "b" }] },
            ],
          },
        ],
      },
    ] as Block[]);
    const ol = document.querySelector(
      '[data-rich-text="list"][data-style="ordered"] ol',
    ) as HTMLOListElement | null;
    expect(ol).not.toBeNull();
    // Native <ol> `start` attribute drives the browser's ::marker counter.
    expect(ol!.getAttribute("start")).toBe("5");
  });

  it("list `border: 1` renders a left-bar", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_list",
            style: "bullet",
            border: 1,
            elements: [
              { type: "rich_text_section", elements: [{ type: "text", text: "x" }] },
            ],
          },
        ],
      },
    ] as Block[]);
    const wrapper = document.querySelector('[data-rich-text="list"]')!;
    const bar = wrapper.querySelector('[aria-hidden="true"]');
    expect(bar).toBeInTheDocument();
    expect(bar!.className).toContain("w-1");
  });

  it("preformatted surfaces `language` as data-language + border", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_preformatted",
            border: 1,
            language: "python",
            elements: [{ type: "text", text: "print('ok')" }],
          },
        ],
      },
    ] as Block[]);
    const pre = document.querySelector(
      '[data-rich-text="preformatted"] pre',
    )!;
    expect(pre.getAttribute("data-language")).toBe("python");
  });

  it("text `style.underline` renders as <u>", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_section",
            elements: [
              { type: "text", text: "underlined", style: { underline: true } },
            ],
          },
        ],
      },
    ] as Block[]);
    expect(screen.getByText("underlined").tagName).toBe("U");
  });

  it("link `style.unlink` renders plain text (no <a>)", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_section",
            elements: [
              {
                type: "link",
                url: "https://example.com",
                text: "unlinked",
                style: { unlink: true },
              },
            ],
          },
        ],
      },
    ] as Block[]);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("unlinked")).toBeInTheDocument();
  });

  it("renders bold/italic/strike/code inline styles distinctly", () => {
    renderBlocks([
      {
        type: "rich_text",
        elements: [
          {
            type: "rich_text_section",
            elements: [
              { type: "text", text: "B", style: { bold: true } },
              { type: "text", text: "I", style: { italic: true } },
              { type: "text", text: "S", style: { strike: true } },
              { type: "text", text: "C", style: { code: true } },
            ],
          },
        ],
      },
    ] as Block[]);
    expect(screen.getByText("B").tagName).toBe("B");
    expect(screen.getByText("I").tagName).toBe("I");
    expect(screen.getByText("S").tagName).toBe("S");
    expect(screen.getByText("C").tagName).toBe("CODE");
  });
});
