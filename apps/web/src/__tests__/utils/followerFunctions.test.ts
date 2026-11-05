import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import * as cheerio from "cheerio";

// Exercise retrieval and validation independently of Next's persistent cache.
vi.mock("next/cache", () => ({
  unstable_cache: (fn: () => Promise<number>) => fn,
}));

import { scrapeMeetupMemberCount } from "@/utils/followerFunctions";

const fixture = readFileSync(
  resolve(__dirname, "fixtures/meetup-solana.html"),
  "utf8",
);

type FixtureData = {
  props: {
    pageProps: {
      country?: string;
      topic: { urlkey: string; countryStats: { memberCount?: unknown } };
    };
  };
};

function withData(change: (data: FixtureData) => void): string {
  const $ = cheerio.load(fixture);
  const data = JSON.parse($("#__NEXT_DATA__").text());
  change(data);
  $("#__NEXT_DATA__").text(JSON.stringify(data));
  return $.html();
}

function mockResponse(html: string, status = 200) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(html, { status }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe("scrapeMeetupMemberCount", () => {
  it("reads the worldwide member total from the real-page fixture, not groups", async () => {
    const fetchMock = mockResponse(fixture);
    expect(cheerio.load(fixture)("div.font-medium")).toHaveLength(0);
    await expect(scrapeMeetupMemberCount()).resolves.toBe(10431);
    expect(fetchMock).toHaveBeenCalledExactlyOnceWith(
      "https://www.meetup.com/topics/solana/",
      expect.objectContaining({ cache: "no-store", signal: expect.anything() }),
    );
  });

  it("does not depend on visible count formatting, labels, or CSS classes", async () => {
    mockResponse(
      fixture
        .replaceAll("10,431", "10\u202f431")
        .replaceAll("ds2-b16", "new-style")
        .replace(">members<", ">membres<"),
    );
    await expect(scrapeMeetupMemberCount()).resolves.toBe(10431);
  });

  it.each([0, 1, 1234567])(
    "preserves a valid numeric count: %s",
    async (count) => {
      mockResponse(
        withData((d) => {
          d.props.pageProps.topic.countryStats.memberCount = count;
        }),
      );
      await expect(scrapeMeetupMemberCount()).resolves.toBe(count);
    },
  );

  it.each([undefined, null, "10431", -1, 1.5, 9007199254740992])(
    "rejects an invalid member count: %s",
    async (count) => {
      mockResponse(
        withData((d) => {
          d.props.pageProps.topic.countryStats.memberCount = count;
        }),
      );
      await expect(scrapeMeetupMemberCount()).rejects.toThrow(
        "Meetup member count was invalid",
      );
    },
  );

  it.each(["us", undefined])(
    "rejects non-worldwide or missing scope: %s",
    async (country) => {
      mockResponse(
        withData((d) => {
          d.props.pageProps.country = country;
        }),
      );
      await expect(scrapeMeetupMemberCount()).rejects.toThrow(
        "worldwide scope did not match",
      );
    },
  );

  it("rejects another topic", async () => {
    mockResponse(
      withData((d) => {
        d.props.pageProps.topic.urlkey = "ethereum";
      }),
    );
    await expect(scrapeMeetupMemberCount()).rejects.toThrow(
      "topic or worldwide scope did not match",
    );
  });

  it("does not substitute groupCount when memberCount is missing", async () => {
    mockResponse(
      withData((d) => {
        delete d.props.pageProps.topic.countryStats.memberCount;
      }),
    );
    await expect(scrapeMeetupMemberCount()).rejects.toThrow(
      "member count was invalid",
    );
  });

  it.each([
    "<html>Verify you are human</html>",
    "<script id='__NEXT_DATA__'>{broken</script>",
    "<script id='__NEXT_DATA__'>null</script>",
  ])("rejects missing or malformed data", async (html) => {
    mockResponse(html);
    await expect(scrapeMeetupMemberCount()).rejects.toThrow();
  });

  it.each([403, 429, 500])(
    "rejects HTTP %s even if the body contains data",
    async (status) => {
      mockResponse(fixture, status);
      await expect(scrapeMeetupMemberCount()).rejects.toThrow(
        `Meetup returned ${status}`,
      );
    },
  );

  it.each([
    new Error("Network failure"),
    new DOMException("Timed out", "TimeoutError"),
  ])("propagates request failures instead of returning zero", async (error) => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(error));
    await expect(scrapeMeetupMemberCount()).rejects.toBe(error);
  });

  it("can retrieve a valid count after an earlier failed request", async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("Network failure"))
      .mockResolvedValueOnce(new Response(fixture));
    vi.stubGlobal("fetch", fetchMock);
    await expect(scrapeMeetupMemberCount()).rejects.toThrow("Network failure");
    await expect(scrapeMeetupMemberCount()).resolves.toBe(10431);
  });
});
