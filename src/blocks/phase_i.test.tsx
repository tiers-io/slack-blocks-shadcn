import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { Message } from "../message";
import { ConfirmDialog } from "../composition/ConfirmDialog";
import type { Block } from "../types";

describe("Phase I — TableBlock + ConfirmDialog + realignment", () => {
  describe("table", () => {
    it("renders a header row + body rows with column alignment", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "table",
              column_settings: [
                { align: "left" },
                { align: "center" },
                { align: "right", is_wrapped: true },
              ],
              rows: [
                [
                  { type: "raw_text", text: "Name" },
                  { type: "raw_text", text: "Status" },
                  { type: "raw_text", text: "Notes" },
                ],
                [
                  { type: "raw_text", text: "auth" },
                  { type: "raw_text", text: "OK" },
                  { type: "raw_text", text: "Ship" },
                ],
              ],
            },
          ] as Block[]}
        />,
      );
      const table = document.querySelector('[data-block="table"]')!;
      const headers = table.querySelectorAll('tr[data-row="header"] td');
      expect(headers).toHaveLength(3);
      expect(headers[0]!.className).toContain("text-left");
      expect(headers[1]!.className).toContain("text-center");
      expect(headers[2]!.className).toContain("text-right");
      expect(headers[2]!.getAttribute("data-wrapped")).toBe("true");
      expect(table.querySelectorAll('tr[data-row="body"]')).toHaveLength(1);
      expect(screen.getByText("auth")).toBeInTheDocument();
    });

    it("renders rich_text cells inline", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "table",
              rows: [
                [{ type: "raw_text", text: "tag" }],
                [
                  {
                    type: "rich_text",
                    elements: [
                      {
                        type: "rich_text_section",
                        elements: [
                          { type: "text", text: "hot", style: { bold: true } },
                        ],
                      },
                    ],
                  },
                ],
              ],
            },
          ] as Block[]}
        />,
      );
      const cell = document.querySelector(
        '[data-block="table"] tr[data-row="body"] td',
      )!;
      expect(cell.querySelector('[data-block="rich_text"]')).toBeInTheDocument();
      expect(screen.getByText("hot").tagName).toBe("SPAN");
    });
  });

  describe("confirm dialog", () => {
    function Harness({ onConfirm }: { onConfirm: () => void }) {
      const [open, setOpen] = useState(true);
      return (
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          spec={{
            title: { type: "plain_text", text: "Are you sure?" },
            text: { type: "plain_text", text: "This cannot be undone." },
            confirm: { type: "plain_text", text: "Yes" },
            deny: { type: "plain_text", text: "No" },
            style: "danger",
          }}
          onConfirm={onConfirm}
        />
      );
    }

    it("runs onConfirm when Confirm is clicked", async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      render(<Harness onConfirm={onConfirm} />);
      expect(screen.getByText("Are you sure?")).toBeInTheDocument();
      await user.click(screen.getByText("Yes"));
      expect(onConfirm).toHaveBeenCalledOnce();
    });

    it("dismisses without confirm on Deny", async () => {
      const user = userEvent.setup();
      const onConfirm = vi.fn();
      render(<Harness onConfirm={onConfirm} />);
      await user.click(screen.getByText("No"));
      expect(onConfirm).not.toHaveBeenCalled();
      expect(screen.queryByText("Are you sure?")).not.toBeInTheDocument();
    });
  });

  describe("section expand", () => {
    it("when expand=false, shows 'Show more' and toggles", async () => {
      const user = userEvent.setup();
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "A lot of text here spread over many lines.",
              },
              expand: false,
            },
          ] as Block[]}
        />,
      );
      const toggle = screen.getByText("Show more");
      expect(toggle).toBeInTheDocument();
      await user.click(toggle);
      expect(screen.getByText("Show less")).toBeInTheDocument();
    });
  });

  describe("image block", () => {
    it("passes width/height through to <img>, flags is_animated via data attr", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "image",
              image_url: "https://img.example/pic.gif",
              alt_text: "demo",
              image_width: 640,
              image_height: 360,
              image_bytes: 12345,
              is_animated: true,
            },
          ] as Block[]}
        />,
      );
      const figure = document.querySelector('[data-block="image"]')!;
      expect(figure.getAttribute("data-animated")).toBe("true");
      const img = figure.querySelector("img")!;
      expect(img.getAttribute("width")).toBe("640");
      expect(img.getAttribute("height")).toBe("360");
      expect(img.getAttribute("data-bytes")).toBe("12345");
    });
  });

  describe("text object verbatim", () => {
    it("prints raw text without parsing when verbatim=true", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: "literal *stars* <@U123> here",
                verbatim: true,
              },
            },
          ] as Block[]}
        />,
      );
      expect(
        screen.getByText(/literal \*stars\* <@U123> here/),
      ).toBeInTheDocument();
    });
  });
});
