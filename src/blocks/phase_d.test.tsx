import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "../message";
import type { Block } from "../types";

describe("Phase D blocks", () => {
  describe("actions + button", () => {
    it("renders a primary url button as an anchor", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "View run" },
                  url: "https://ci.example/42",
                  style: "primary",
                },
              ],
            },
          ] as Block[]}
        />,
      );
      const a = screen.getByText("View run").closest("a")!;
      expect(a.getAttribute("href")).toBe("https://ci.example/42");
      expect(a.getAttribute("data-variant")).toBe("default");
    });

    it("renders a no-url button as an interactive styled button", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  action_id: "approve",
                  text: { type: "plain_text", text: "Approve" },
                  style: "danger",
                },
              ],
            },
          ] as Block[]}
        />,
      );
      const btn = screen.getByText("Approve").closest("button")!;
      expect(btn).not.toBeDisabled();
      expect(btn.className).toContain("bg-destructive");
    });

    it("renders select elements with chevron + placeholder (interactive)", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "actions",
              elements: [
                {
                  type: "static_select",
                  action_id: "x",
                  placeholder: { text: "Pick one" },
                  options: [
                    { text: { type: "plain_text", text: "A" }, value: "a" },
                  ],
                },
              ],
            },
          ] as Block[]}
        />,
      );
      expect(screen.getByText("Pick one")).toBeInTheDocument();
      const trigger = screen.getByRole("button", { name: /Pick one/ });
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      expect(trigger).toHaveAttribute("aria-haspopup", "listbox");
      expect(trigger).not.toBeDisabled();
    });
  });

  describe("file", () => {
    it("renders filename + open link", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "file",
              file: {
                name: "report.pdf",
                mimetype: "application/pdf",
                size: 24576,
                permalink: "https://slack.example/files/report",
              },
            },
          ] as Block[]}
        />,
      );
      expect(screen.getByText("report.pdf")).toBeInTheDocument();
      const a = screen.getByText("Open in Slack").closest("a")!;
      expect(a.getAttribute("href")).toBe("https://slack.example/files/report");
    });
  });

  describe("alert", () => {
    it.each(["default", "info", "warning", "error"] as const)(
      "renders %s level with correct data attributes",
      (level) => {
        render(
          <Message
            size="default"
            blocks={[
              {
                type: "alert",
                level,
                description: `${level} message`,
              },
            ] as Block[]}
          />,
        );
        const el = document.querySelector(
          `[data-block="alert"][data-level="${level}"]`,
        );
        expect(el).toBeInTheDocument();
        expect(screen.getByText(`${level} message`)).toBeInTheDocument();
      },
    );
  });

  describe("markdown", () => {
    it("parses full markdown (double-star bold + inline code)", () => {
      render(
        <Message
          size="default"
          blocks={[
            { type: "markdown", text: "Deploy **succeeded** for `main`." },
          ] as Block[]}
        />,
      );
      expect(screen.getByText("succeeded").tagName).toBe("STRONG");
      expect(screen.getByText("main").tagName).toBe("CODE");
    });
  });

  describe("video", () => {
    it("renders a thumbnail + play affordance", () => {
      render(
        <Message
          size="default"
          blocks={[
            {
              type: "video",
              video_url: "https://youtube.example/x",
              thumbnail_url: "https://img.example/thumb.jpg",
              alt_text: "demo",
              title: { type: "plain_text", text: "Demo video" },
              provider_name: "YouTube",
            },
          ] as Block[]}
        />,
      );
      expect(
        document.querySelector('[data-block="video"] img'),
      ).toBeInTheDocument();
      expect(screen.getByLabelText("Play demo")).toHaveAttribute(
        "href",
        "https://youtube.example/x",
      );
      expect(screen.getByText("Demo video")).toBeInTheDocument();
    });
  });
});
