import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils/style";

describe("cn Tailwind 4 compatibility", () => {
  it("resolves Tailwind 4 outline utilities", () => {
    expect(cn("focus:outline-none", "focus:outline-hidden")).toBe(
      "focus:outline-hidden",
    );
  });

  it("keeps background colors alongside Tailwind 4 gradients", () => {
    expect(cn("bg-card", "bg-linear-to-r")).toBe("bg-card bg-linear-to-r");
  });

  it("still resolves ordinary utility conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
