import { describe, expect, it } from "vitest";
import {
  shouldRenderSignature,
  signatureSeed,
} from "@/components/alpenglow/types";

describe("Alpenglow artwork sampling", () => {
  it("derives a stable seed from each signature", () => {
    expect(signatureSeed("5igNatureA")).toBe(signatureSeed("5igNatureA"));
    expect(signatureSeed("5igNatureA")).not.toBe(signatureSeed("5igNatureB"));
  });

  it("samples deterministically rather than randomly", () => {
    const decisions = Array.from({ length: 10 }, () =>
      shouldRenderSignature("stable-signature", 0.08),
    );
    expect(new Set(decisions).size).toBe(1);
  });
});
