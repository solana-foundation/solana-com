import fetcher from "../fetcher";

describe("fetcher", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
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
