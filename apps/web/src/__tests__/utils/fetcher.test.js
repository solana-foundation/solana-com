import fetcher from "@/utils/fetcher";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("fetcher", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      }),
    );
    fetch.mockClear();
  });

  it("should fetch page", async () => {
    const url = `/api`;

    const response = await fetcher(url);

    expect(response.success).toBe(true);
  });
});
