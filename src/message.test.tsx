import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Message } from "./message";

describe("Message (scaffold)", () => {
  it("renders without throwing", () => {
    const { container } = render(<Message blocks={[]} size="default" />);
    expect(container).toBeInTheDocument();
  });

  it("accepts all three sizes", () => {
    for (const size of ["sm", "default", "lg"] as const) {
      render(<Message blocks={[]} size={size} />);
    }
  });
});
