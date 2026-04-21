import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "../message";
import gfmTable from "../../fixtures/markdown-gfm-table.json";
import type { Block } from "../types";

describe("MarkdownBlock (Phase L — react-markdown + remark-gfm)", () => {
  it("renders a GFM table with <thead> + <tbody>", () => {
    render(<Message blocks={gfmTable as Block[]} />);
    const mdBlock = document.querySelector('[data-block="markdown"]')!;
    const table = mdBlock.querySelector("table")!;
    expect(table).toBeInTheDocument();
    expect(table.querySelector("thead")).toBeInTheDocument();
    expect(table.querySelector("tbody")).toBeInTheDocument();
    expect(table.querySelectorAll("thead th")).toHaveLength(3);
    expect(table.querySelectorAll("tbody tr")).toHaveLength(3);
    // align styles from GFM :---: + ---:
    const ths = table.querySelectorAll("thead th");
    expect(ths[1]!.getAttribute("style")).toContain("center");
    expect(ths[2]!.getAttribute("style")).toContain("right");
  });

  it("renders GFM task lists with checkboxes", () => {
    render(<Message blocks={gfmTable as Block[]} />);
    const checkboxes = document.querySelectorAll<HTMLInputElement>(
      '[data-block="markdown"] input[type="checkbox"]',
    );
    expect(checkboxes).toHaveLength(3);
    expect(checkboxes[0]!.checked).toBe(true);
    expect(checkboxes[1]!.checked).toBe(true);
    expect(checkboxes[2]!.checked).toBe(false);
  });

  it("renders ~~strike~~ via remark-gfm", () => {
    render(<Message blocks={gfmTable as Block[]} />);
    expect(screen.getByText("deprecated").tagName).toBe("DEL");
  });

  it("uses the InlineLink registry slot for anchors", () => {
    const Custom = ({ href, children }: { href: string; children: React.ReactNode }) => (
      <span data-testid="custom-link" data-href={href}>
        {children}
      </span>
    );
    render(
      <Message
        components={{ InlineLink: Custom as never }}
        blocks={[
          {
            type: "markdown",
            text: "check out [the spec](https://api.slack.com/reference)",
          },
        ] as Block[]}
      />,
    );
    const link = screen.getByTestId("custom-link");
    expect(link.getAttribute("data-href")).toBe(
      "https://api.slack.com/reference",
    );
  });
});
