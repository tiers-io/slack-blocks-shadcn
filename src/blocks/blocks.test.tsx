import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Message } from "../message";
import sectionBasic from "../../fixtures/section-basic.json";
import sectionFields from "../../fixtures/section-fields.json";
import headerDivider from "../../fixtures/header-and-divider.json";
import contextMixed from "../../fixtures/context-mixed.json";
import imageCaptioned from "../../fixtures/image-captioned.json";
import type { Block } from "../types";

function renderBlocks(blocks: unknown[]) {
  return render(<Message blocks={blocks as Block[]} size="default" />);
}

describe("5 core blocks (dispatch + rendering)", () => {
  it("renders section text", () => {
    renderBlocks(sectionBasic);
    expect(screen.getByText(/Build succeeded/)).toBeInTheDocument();
    expect(
      document.querySelector('[data-block="section"]'),
    ).toBeInTheDocument();
  });

  it("renders section fields as a grid", () => {
    renderBlocks(sectionFields);
    expect(screen.getByText(/Incident resolved/)).toBeInTheDocument();
    expect(screen.getByText(/SEV-2/)).toBeInTheDocument();
    expect(screen.getByText(/us-east-1/)).toBeInTheDocument();
  });

  it("renders a header + a divider", () => {
    renderBlocks(headerDivider);
    expect(screen.getByText("Weekly deploys")).toBeInTheDocument();
    expect(
      document.querySelector('[data-block="divider"]'),
    ).toBeInTheDocument();
  });

  it("renders context mixing image + text fragments", () => {
    renderBlocks(contextMixed);
    const context = document.querySelector('[data-block="context"]');
    expect(context).toBeInTheDocument();
    expect(context!.querySelector("img")).toBeInTheDocument();
  });

  it("renders an image with caption", () => {
    renderBlocks(imageCaptioned);
    expect(screen.getByText(/Weekly active users/)).toBeInTheDocument();
    expect(document.querySelector('[data-block="image"] img')).toBeInTheDocument();
  });

  it("renders at all three sizes without throwing", () => {
    for (const size of ["sm", "default", "lg"] as const) {
      render(
        <Message blocks={sectionFields as Block[]} size={size} />,
      );
    }
  });

  it("falls through unknown block types without throwing", () => {
    const blocks: Block[] = [
      { type: "futuristic_block", payload: {} } as Block,
      { type: "section", text: { type: "mrkdwn", text: "still here" } } as Block,
    ];
    renderBlocks(blocks);
    expect(screen.getByText("still here")).toBeInTheDocument();
  });
});
