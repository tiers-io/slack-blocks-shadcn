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
    expect(screen.getByText("Everything green").tagName).toBe("SPAN");
    expect(screen.getByText("Everything green").className).toMatch(
      /font-semibold.*italic|italic.*font-semibold/,
    );
    const link = screen.getByText("view build");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe("https://ci.example/build/4821");
  });

  it("renders a bullet list with three items", () => {
    renderBlocks(mixed);
    const list = document.querySelector('[data-rich-text="list"][data-style="bullet"]');
    expect(list).toBeInTheDocument();
    expect(list!.tagName).toBe("UL");
    expect(list!.querySelectorAll("li")).toHaveLength(3);
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

  it("renders preformatted code as <pre>", () => {
    renderBlocks(mixed);
    const pre = document.querySelector('[data-rich-text="preformatted"]');
    expect(pre).toBeInTheDocument();
    expect(pre!.tagName).toBe("PRE");
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
    const ol = document.querySelector('[data-rich-text="list"][data-style="ordered"]');
    expect(ol!.tagName).toBe("OL");
    expect(ol!.querySelectorAll("li")).toHaveLength(2);
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
    expect(screen.getByText("B").className).toContain("font-semibold");
    expect(screen.getByText("I").className).toContain("italic");
    expect(screen.getByText("S").className).toContain("line-through");
    expect(screen.getByText("C").className).toContain("font-mono");
  });
});
