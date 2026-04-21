import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "../message";
import type { Block } from "../types";

describe("Phase E blocks", () => {
  it("input: renders label + disabled element + hint", () => {
    render(
      <Message
        size="default"
        blocks={[
          {
            type: "input",
            label: { type: "plain_text", text: "Team" },
            element: {
              type: "static_select",
              action_id: "team",
              placeholder: { text: "Choose a team" },
            },
            hint: { type: "plain_text", text: "You can change this later" },
          },
        ] as Block[]}
      />,
    );
    expect(screen.getByText("Team").tagName).toBe("LABEL");
    expect(
      document.querySelector('[data-element="static_select"]'),
    ).toBeDisabled();
    expect(
      screen.getByText("You can change this later"),
    ).toBeInTheDocument();
  });

  it("context_actions: renders a row of buttons", () => {
    render(
      <Message
        size="default"
        blocks={[
          {
            type: "context_actions",
            elements: [
              {
                type: "button",
                text: { type: "plain_text", text: "Approve" },
                url: "https://x",
              },
              {
                type: "button",
                text: { type: "plain_text", text: "Reject" },
                style: "danger",
              },
            ],
          },
        ] as Block[]}
      />,
    );
    const container = document.querySelector('[data-block="context_actions"]')!;
    expect(container.querySelectorAll('[data-element="button"]')).toHaveLength(
      2,
    );
  });

  it("card: renders title + body, does not double-frame", () => {
    render(
      <Message
        size="default"
        blocks={[
          {
            type: "card",
            title: { type: "plain_text", text: "Release v1.2" },
            body: [
              {
                type: "mrkdwn",
                text: "Shipped *auth* + `rate-limit`.",
              },
            ],
          },
        ] as Block[]}
      />,
    );
    expect(screen.getByText("Release v1.2")).toBeInTheDocument();
    expect(screen.getByText("auth").tagName).toBe("STRONG");
    const cards = document.querySelectorAll('[data-block="card"]');
    expect(cards).toHaveLength(1);
  });

  it("carousel: scrollable track with overflow-x-auto", () => {
    render(
      <Message
        size="default"
        blocks={[
          {
            type: "carousel",
            items: [
              { type: "card", title: { type: "plain_text", text: "A" } },
              { type: "card", title: { type: "plain_text", text: "B" } },
              { type: "card", title: { type: "plain_text", text: "C" } },
            ],
          },
        ] as Block[]}
      />,
    );
    const track = document.querySelector("[data-carousel-track]")!;
    expect(track.className).toContain("overflow-x-auto");
    expect(track.querySelectorAll('[data-block="card"]')).toHaveLength(3);
  });

  it("plan: shows progress badge + per-item status icons", () => {
    render(
      <Message
        size="default"
        blocks={[
          {
            type: "plan",
            title: { type: "plain_text", text: "Launch checklist" },
            items: [
              {
                title: { type: "plain_text", text: "Write tests" },
                status: "done",
              },
              {
                title: { type: "plain_text", text: "Bump version" },
                status: "in_progress",
              },
              {
                title: { type: "plain_text", text: "Announce" },
                status: "todo",
              },
            ],
          },
        ] as Block[]}
      />,
    );
    expect(screen.getByText("1/3")).toBeInTheDocument();
    const statuses = Array.from(
      document.querySelectorAll("[data-plan-status]"),
    ).map((el) => el.getAttribute("data-plan-status"));
    expect(statuses).toEqual(["done", "in_progress", "todo"]);
  });

  it("task_card: renders status badge + dot, picks correct colour", () => {
    render(
      <Message
        size="default"
        blocks={[
          {
            type: "task_card",
            title: { type: "plain_text", text: "Ship auth fix" },
            status: "blocked",
            priority: "urgent",
            assignee: "alex",
            due: "2026-04-30",
          },
        ] as Block[]}
      />,
    );
    const card = document.querySelector('[data-block="task_card"]')!;
    expect(card.getAttribute("data-status")).toBe("blocked");
    expect(screen.getByText("Blocked")).toBeInTheDocument();
    expect(
      card.querySelector('[data-status-dot="blocked"]')!.className,
    ).toContain("bg-destructive");
    expect(screen.getByText("@alex")).toBeInTheDocument();
    expect(screen.getByText("↑ urgent").className).toContain(
      "text-destructive",
    );
    expect(screen.getByText("due 2026-04-30")).toBeInTheDocument();
  });
});
