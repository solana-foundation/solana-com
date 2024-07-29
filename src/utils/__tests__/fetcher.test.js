import fetcher from "../fetcher";

describe("fetcher", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  describe("fetcher", () => {
    it("should fetch page", async () => {
      const url = `/api`;

      const response = await fetcher(url);

      expect(response.success).toBe(true);
    });
  });
});
