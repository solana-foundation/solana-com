import fetcher from "@/utils/fetcher";

describe("fetcher", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      }),
    ) as unknown as typeof fetch;
    (global.fetch as jest.Mock).mockClear();
  });

  it("should fetch page", async () => {
    const url = `/api`;

    const response = await fetcher<{ success: true }>(url);

    expect(response.success).toBe(true);
  });
});
