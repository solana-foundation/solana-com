import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/reader", () => ({ reader: {} }));

const { normalizeClients } = await import("@/lib/upgrades/releases");

describe("normalizeClients", () => {
  it("keeps named clients and treats a blank version as not yet known", () => {
    expect(
      normalizeClients([
        { name: "Agave", version: "v4.4", url: "https://example.com/notes" },
        { name: " Firedancer ", version: "", url: "" },
      ]),
    ).toEqual([
      { name: "Agave", version: "v4.4", url: "https://example.com/notes" },
      { name: "Firedancer", version: "", url: null },
    ]);
  });

  it("drops entries without a name and unsafe links", () => {
    expect(
      normalizeClients([
        { name: "", version: "v1.0" },
        { name: "Agave", version: "v4.4", url: "javascript:alert(1)" },
        null,
      ]),
    ).toEqual([{ name: "Agave", version: "v4.4", url: null }]);
  });

  it("returns an empty list for a missing field", () => {
    expect(normalizeClients(undefined)).toEqual([]);
  });
});
