import { afterEach, describe, expect, it, vi } from "vitest";
import { allow } from "@/lib/delivery-vs-payment/server/rateLimit";

describe("DvP public endpoint limits", () => {
  afterEach(() => vi.useRealTimers());

  it("preserves a live global bucket when distinct callers fill capacity", () => {
    vi.useFakeTimers();
    vi.setSystemTime(1_000);
    expect(allow("fund:global", 2, 60_000)).toBe(true);
    for (let index = 0; index < 9_999; index++) {
      expect(allow(`fund:ip-${index}`, 1, 60_000)).toBe(true);
    }
    expect(allow("fund:new-client", 1, 60_000)).toBe(false);
    expect(allow("fund:global", 2, 60_000)).toBe(true);
    expect(allow("fund:global", 2, 60_000)).toBe(false);

    vi.setSystemTime(61_001);
    expect(allow("fund:global", 2, 60_000)).toBe(true);
  });
});
