import { describe, expect, it } from "vitest";
import { cn } from "@/app/components/utils";

describe("cn Tailwind 3 compatibility", () => {
  it("keeps Tailwind 3 outline style and width utilities together", () => {
    expect(cn("focus-visible:outline", "focus-visible:outline-2")).toBe(
      "focus-visible:outline focus-visible:outline-2",
    );
  });

  it("keeps background colors alongside Tailwind 3 gradients", () => {
    expect(cn("bg-card", "bg-gradient-to-r")).toBe("bg-card bg-gradient-to-r");
  });

  it("still resolves ordinary utility conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
