import { describe, expect, it } from "vitest";
import { loadBreakpointMessages } from "@/i18n/request";

describe("i18n request config", () => {
  it("loads English by default for unsupported locales", async () => {
    const result = await loadBreakpointMessages("xx");

    expect(result.locale).toBe("en");
    expect(result.messages.breakpoint.metadata.title).toBe("Breakpoint 2026");
  });

  it("merges locale overrides on top of English content", async () => {
    const result = await loadBreakpointMessages("es");

    expect(result.locale).toBe("es");
    expect(result.messages.breakpoint.metadata.title).toBe("Breakpoint 2026");
  });
});
