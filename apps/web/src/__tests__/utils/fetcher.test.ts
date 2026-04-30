import fetcher from "@/utils/fetcher";
import { beforeEach, describe, expect, it, vi, type Mock } from "vitest";

describe("fetcher", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      }),
    ) as unknown as typeof fetch;
    (global.fetch as Mock).mockClear();
  });

  it("should fetch page", async () => {
    const url = `/api`;

    const response = await fetcher<{ success: true }>(url);

    expect(response.success).toBe(true);
  });
});
