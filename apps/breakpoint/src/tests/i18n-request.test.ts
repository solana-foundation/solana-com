import { describe, expect, it } from "vitest";
import { loadBreakpointMessages } from "@/i18n/request";

describe("i18n request config", () => {
  it("loads English by default for unsupported locales", async () => {
    const result = await loadBreakpointMessages("xx");

    expect(result.locale).toBe("en");
    expect(result.messages).toEqual({});
  });

  it("returns an empty local catalog when no breakpoint-specific messages exist", async () => {
    const result = await loadBreakpointMessages("es");

    expect(result.locale).toBe("es");
    expect(result.messages).toEqual({});
  });
});
