import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MentionPill } from "./MentionPill";

describe("MentionPill", () => {
  it.each(["user", "channel", "usergroup", "broadcast"] as const)(
    "renders %s variant with data-variant attribute",
    (variant) => {
      render(<MentionPill variant={variant}>@label</MentionPill>);
      expect(screen.getByText("@label")).toHaveAttribute(
        "data-variant",
        variant,
      );
    },
  );

  it("applies the expected token class per variant", () => {
    render(
      <>
        <MentionPill variant="user">u</MentionPill>
        <MentionPill variant="channel">c</MentionPill>
        <MentionPill variant="broadcast">b</MentionPill>
      </>,
    );
    expect(screen.getByText("u").className).toContain("text-primary");
    expect(screen.getByText("c").className).toContain("bg-muted");
    expect(screen.getByText("b").className).toContain("text-destructive");
  });
});
