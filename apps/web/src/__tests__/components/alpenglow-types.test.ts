import { describe, expect, it } from "vitest";
import { signatureSeed } from "@/components/alpenglow/types";

describe("Alpenglow artwork sampling", () => {
  it("derives a stable seed from each signature", () => {
    expect(signatureSeed("5igNatureA")).toBe(signatureSeed("5igNatureA"));
    expect(signatureSeed("5igNatureA")).not.toBe(signatureSeed("5igNatureB"));
  });
});
