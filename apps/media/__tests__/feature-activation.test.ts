import { describe, expect, it } from "vitest";
import { getBase64Decoder, type Address } from "@solana/kit";
import { readFeatureAccountState } from "@/lib/upgrades/feature-activation";

const FEATURE_GATE_PROGRAM_ADDRESS =
  "Feature111111111111111111111111111111" as Address;

function featureAccount(data: Uint8Array) {
  return {
    data: [getBase64Decoder().decode(data), "base64"] as const,
    owner: FEATURE_GATE_PROGRAM_ADDRESS,
  };
}

describe("readFeatureAccountState", () => {
  it("returns not-set when the feature account does not exist", () => {
    expect(readFeatureAccountState(null)).toBe("not-set");
  });

  it("returns pending when the activation slot is unset", () => {
    expect(readFeatureAccountState(featureAccount(new Uint8Array(9)))).toBe(
      "pending",
    );
  });

  it("returns active when the activation slot is set", () => {
    expect(
      readFeatureAccountState(
        featureAccount(new Uint8Array([1, 42, 0, 0, 0, 0, 0, 0, 0])),
      ),
    ).toBe("active");
  });

  it("rejects accounts not owned by the feature gate program", () => {
    expect(() =>
      readFeatureAccountState({
        ...featureAccount(new Uint8Array(9)),
        owner: "11111111111111111111111111111111" as Address,
      }),
    ).toThrow("Invalid feature gate account");
  });
});
