import { describe, expect, it } from "vitest";
import { sized, sizing } from "./sizing";

describe("sizing", () => {
  it("exposes all three sizes", () => {
    expect(Object.keys(sizing).sort()).toEqual(["default", "lg", "sm"]);
  });

  it("monotonically scales the body text class", () => {
    expect(sizing.sm.body).toContain("text-xs");
    expect(sizing.default.body).toContain("text-sm");
    expect(sizing.lg.body).toContain("text-base");
  });

  it("returns a specific axis via sized()", () => {
    expect(sized("default", "padding")).toBe("p-3");
    expect(sized("lg", "header")).toContain("text-lg");
  });
});
