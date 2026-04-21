import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "./message";
import type { Block } from "./types";

describe("components override registry", () => {
  describe("block slot", () => {
    it("renders the default SectionBlock when no override is provided", () => {
      render(
        <Message
          blocks={[
            {
              type: "section",
              text: { type: "mrkdwn", text: "hello" },
            },
          ] as Block[]}
        />,
      );
      expect(
        document.querySelector('[data-block="section"]'),
      ).toBeInTheDocument();
    });

    it("renders a custom SectionBlock when passed via `components`", () => {
      const Custom = ({ block }: { block: { text?: { text: string } } }) => (
        <div data-testid="custom-section">CUSTOM:{block.text?.text}</div>
      );
      render(
        <Message
          components={{ SectionBlock: Custom as never }}
          blocks={[
            {
              type: "section",
              text: { type: "mrkdwn", text: "hello" },
            },
          ] as Block[]}
        />,
      );
      expect(screen.getByTestId("custom-section")).toHaveTextContent(
        "CUSTOM:hello",
      );
      expect(
        document.querySelector('[data-block="section"]'),
      ).not.toBeInTheDocument();
    });
  });

  describe("element slot", () => {
    it("renders a custom ButtonElement via `components`", () => {
      const CustomBtn = ({ element }: { element: { text?: { text: string } } }) => (
        <span data-testid="custom-btn">BTN:{element.text?.text}</span>
      );
      render(
        <Message
          components={{ ButtonElement: CustomBtn as never }}
          blocks={[
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "go" },
                },
              ],
            },
          ] as Block[]}
        />,
      );
      expect(screen.getByTestId("custom-btn")).toHaveTextContent("BTN:go");
    });
  });

  describe("composition slot", () => {
    it("renders a custom MentionPill via `components`", () => {
      const Sticker = ({ children }: { children: React.ReactNode }) => (
        <span data-testid="sticker">★ {children} ★</span>
      );
      render(
        <Message
          components={{ MentionPill: Sticker as never }}
          blocks={[
            {
              type: "rich_text",
              elements: [
                {
                  type: "rich_text_section",
                  elements: [{ type: "user", user_id: "U07HBFWRWA2" }],
                },
              ],
            },
          ] as Block[]}
        />,
      );
      expect(screen.getByTestId("sticker")).toHaveTextContent("★ @U07HBFWRWA2 ★");
    });
  });

  describe("fallback semantics", () => {
    it("keeps defaults for slots NOT overridden even when other slots are", () => {
      const CustomSection = () => (
        <div data-testid="custom-section">overridden</div>
      );
      render(
        <Message
          components={{ SectionBlock: CustomSection as never }}
          blocks={[
            { type: "section", text: { type: "mrkdwn", text: "x" } },
            { type: "divider" },
          ] as Block[]}
        />,
      );
      expect(screen.getByTestId("custom-section")).toBeInTheDocument();
      expect(
        document.querySelector('[data-block="divider"]'),
      ).toBeInTheDocument();
    });
  });
});
