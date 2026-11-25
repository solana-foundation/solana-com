import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildSendLandingBucketQuery,
  buildSendLandingHeadToHeadQuery,
  buildSendLandingProviderQuery,
  buildSendLandingRoundsQuery,
  getSendLandingConfig,
  getSendLandingData,
  getSendLandingFilters,
  getSendLandingRegionParam,
  parseSendLandingQueryOptions,
} from "@/lib/send-landing/server";
import {
  defaultSendLandingRegion,
  getSendLandingDataUrl,
  getSendLandingTimeframeForPage,
  isSendLandingResponse,
  parseSendLandingRegion,
  sendLandingTimeframeOptions,
} from "@/app/[locale]/data/send-landing-config";
import { applyQueryUpdates } from "@/app/[locale]/data/dashboard-query";

const config = {
  url: "https://clickhouse.example.test:8443",
  database: "benchmark",
  user: "reader",
  password: "test-secret",
};
const now = Date.parse("2026-11-09T12:00:42Z");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

const providerRow = {
  provider: "helius",
  rounds: 10,
  landed: 8,
  failed: 1,
  dropped: 1,
  scored_rounds: 9,
  first_on_chain: 3,
  index_p50: 140,
  index_p90: 400,
  later_slot: 2,
  slots_to_land_p50: 1,
  response_p50_ms: 0.7,
  cost_lamports: 90_000,
};

function stubClickHouse(responses: Record<string, unknown[]>) {
  const fetchMock = vi.fn(async (_url: URL, init: RequestInit) => {
    const body = String(init.body);
    const key = body.includes("other_provider")
      ? "pairs"
      : body.includes("toStartOfInterval")
        ? "buckets"
        : body.includes("countIf(status = 'complete')")
          ? "rounds"
          : body.includes("SELECT DISTINCT region")
            ? "regions"
            : body.includes("SELECT DISTINCT provider")
              ? "providerNames"
              : "providers";
    return new Response(JSON.stringify({ data: responses[key] ?? [] }));
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("send landing benchmark", () => {
  it("offers day-plus windows with buckets of at least 15 minutes", () => {
    expect(
      sendLandingTimeframeOptions.map(({ value, stepSeconds }) => [
        value,
        stepSeconds,
      ]),
    ).toEqual([
      ["24h", 900],
      ["7d", 3600],
      ["30d", 14_400],
      ["90d", 43_200],
      ["1y", 172_800],
    ]);
    expect(
      parseSendLandingQueryOptions(
        new URLSearchParams("timeframe=1h&region=ams3"),
      ),
    ).toEqual({ region: "ams", timeframe: "7d" });
    expect(parseSendLandingQueryOptions(new URLSearchParams())).toEqual({
      region: "all",
      timeframe: "7d",
    });
  });

  it("uses server-only credentials and only allows HTTP for local development", () => {
    for (const [key, value] of Object.entries({
      URL: config.url,
      DATABASE: config.database,
      USER: config.user,
      PASSWORD: config.password,
    }))
      vi.stubEnv(`SEND_BENCHMARK_CLICKHOUSE_${key}`, value);
    expect(getSendLandingConfig()).toEqual(config);
    vi.stubEnv(
      "SEND_BENCHMARK_CLICKHOUSE_URL",
      "https://reader:secret@clickhouse.example.test",
    );
    expect(getSendLandingConfig()).toBeUndefined();
    vi.stubEnv(
      "SEND_BENCHMARK_CLICKHOUSE_URL",
      "http://external.example.test:8123",
    );
    expect(getSendLandingConfig()).toBeUndefined();
    vi.stubEnv("SEND_BENCHMARK_CLICKHOUSE_URL", "http://localhost:8123");
    vi.stubEnv("NODE_ENV", "development");
    expect(getSendLandingConfig()?.url).toBe("http://localhost:8123");
    vi.stubEnv("NODE_ENV", "production");
    expect(getSendLandingConfig()).toBeUndefined();
    vi.stubEnv("SEND_BENCHMARK_CLICKHOUSE_PASSWORD", "");
    expect(getSendLandingConfig()).toBeUndefined();
  });

  it("reads only complete rounds, with FINAL, through typed parameters", () => {
    for (const query of [
      buildSendLandingProviderQuery(),
      buildSendLandingHeadToHeadQuery(),
      buildSendLandingBucketQuery(),
    ]) {
      expect(query).toContain("FROM benchmark_send_rounds FINAL");
      expect(query).toContain("FROM benchmark_send_attempts FINAL");
      expect(query).toContain("status = 'complete'");
      expect(query).toContain("{regions:Array(String)}");
      expect(query).toContain("{start:UInt32}");
    }
    expect(buildSendLandingRoundsQuery()).toContain(
      "FROM benchmark_send_rounds FINAL",
    );
    expect(buildSendLandingHeadToHeadQuery()).toContain(
      "(a.slot, a.position) < (b.slot, b.position)",
    );
    expect(buildSendLandingBucketQuery()).toContain("{step:UInt32}");
    expect(buildSendLandingProviderQuery()).toContain(
      "quantileExactIf(0.5)(response_ns, send_status = 'accepted')",
    );
  });

  it("matches every raw label of a canonical region and quotes them", () => {
    expect(getSendLandingRegionParam("all")).toBe("[]");
    expect(getSendLandingRegionParam("ams")).toBe(
      "['ams','ams3','europe-west4']",
    );
    expect(getSendLandingRegionParam("x'y")).toBe("['x\\'y']");
  });

  it("maps query results into a validated response", async () => {
    const fetchMock = stubClickHouse({
      providers: [providerRow, { ...providerRow, provider: "jito" }],
      pairs: [
        { provider: "helius", other_provider: "jito", ahead: 4, rounds: 8 },
        { provider: "jito", other_provider: "helius", ahead: 4, rounds: 8 },
      ],
      buckets: [
        {
          provider: "helius",
          timestamp: 1_794_196_800,
          rounds: 2,
          landed: 2,
          scored_rounds: 2,
          first_on_chain: 1,
        },
      ],
      rounds: [{ complete: 10, skipped: 2 }],
    });
    const data = await getSendLandingData(
      config,
      { region: "fra", timeframe: "24h" },
      now,
    );
    expect(isSendLandingResponse(data)).toBe(true);
    expect(data).toMatchObject({
      generatedAt: "2026-11-09T12:00:42.000Z",
      region: "fra",
      timeframe: "24h",
      stepSeconds: 900,
      rounds: { complete: 10, skipped: 2 },
    });
    // Provider labels go through the shared alias table ("helius" -> "Helius").
    expect(data.providers.map((item) => item.provider)).toEqual([
      "Helius",
      "Jito",
    ]);
    expect(data.providers[0]).toEqual({
      provider: "Helius",
      rounds: 10,
      landed: 8,
      failed: 1,
      dropped: 1,
      scoredRounds: 9,
      firstOnChain: 3,
      indexP50: 140,
      indexP90: 400,
      laterSlot: 2,
      slotsToLandP50: 1,
      responseP50Ms: 0.7,
      costLamports: 90_000,
    });
    expect(data.headToHead[0]).toEqual({
      provider: "Helius",
      otherProvider: "Jito",
      ahead: 4,
      rounds: 8,
    });
    expect(fetchMock).toHaveBeenCalledTimes(4);
    const url = fetchMock.mock.calls[0][0] as URL;
    expect(url.searchParams.get("readonly")).toBe("2");
    expect(url.searchParams.get("database")).toBe("benchmark");
    expect(url.searchParams.get("param_end")).toBe(
      String(Date.parse("2026-11-09T12:00:00Z") / 1000),
    );
    expect(url.searchParams.get("param_start")).toBe(
      String(Date.parse("2026-11-08T12:00:00Z") / 1000),
    );
    expect(url.searchParams.get("param_step")).toBe("900");
    expect(url.searchParams.get("param_regions")).toContain("'fra'");
    expect(String(fetchMock.mock.calls[0][1].body)).not.toContain("fra");
  });

  it("rejects inconsistent counts instead of showing them", async () => {
    stubClickHouse({
      providers: [{ ...providerRow, first_on_chain: 20 }],
      rounds: [{ complete: 10, skipped: 0 }],
    });
    await expect(
      getSendLandingData(config, { region: "all", timeframe: "7d" }, now),
    ).rejects.toThrow("Invalid send benchmark data");
  });

  it("does not expose ClickHouse response text when a query fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(
        async () =>
          new Response("Code: 516. password incorrect for reader@host", {
            status: 500,
          }),
      ),
    );
    const error = await getSendLandingData(
      config,
      { region: "all", timeframe: "7d" },
      now,
    ).catch((caught: Error) => caught);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("Send benchmark query failed (500)");
  });

  it("lists canonical regions in dashboard order and provider labels", async () => {
    stubClickHouse({
      regions: [{ region: "fra2" }, { region: "ewr2" }, { region: "fra" }],
      providerNames: [{ provider: "jito" }, { provider: "cascade" }],
    });
    await expect(getSendLandingFilters(config)).resolves.toEqual({
      regions: ["ewr", "fra"],
      providers: ["Jito", "cascade"],
    });
  });

  it("lists regions and providers from the longest window the section offers", async () => {
    const fetchMock = stubClickHouse({});
    await getSendLandingFilters(config);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [url] of fetchMock.mock.calls)
      expect(new URL(url).searchParams.get("param_lookback")).toBe(
        String(365 * 24 * 60 * 60),
      );
  });

  it("keeps the landing region in the URL; the time frame is the page's", () => {
    const params = new URLSearchParams("tab=senders&timeframe=6h");
    applyQueryUpdates(params, { landingRegion: "fra" }, []);
    expect(params.toString()).toBe("tab=senders&timeframe=6h&region=fra");
    expect(getSendLandingDataUrl("all", "90d")).toBe(
      "/api/senders/landing/data?region=all&timeframe=90d",
    );
  });

  it("follows the page time frame, raising windows under a day to 24h", () => {
    expect(getSendLandingTimeframeForPage("30m")).toEqual({
      timeframe: "24h",
      raised: true,
    });
    expect(getSendLandingTimeframeForPage("6h")).toEqual({
      timeframe: "24h",
      raised: true,
    });
    for (const timeframe of ["24h", "7d", "30d", "90d", "1y"] as const)
      expect(getSendLandingTimeframeForPage(timeframe)).toEqual({
        timeframe,
        raised: false,
      });
    expect(
      sendLandingTimeframeOptions.find((option) => option.value === "1y")
        ?.stepSeconds,
    ).toBe(2 * 24 * 60 * 60);
  });

  it("opens the page on one region, while the API defaults to all", () => {
    expect(parseSendLandingRegion(null, defaultSendLandingRegion)).toBe("fra");
    expect(parseSendLandingRegion("all", defaultSendLandingRegion)).toBe("all");
    expect(parseSendLandingRegion("ewr", defaultSendLandingRegion)).toBe("ewr");
    expect(parseSendLandingRegion(null)).toBe("all");
  });
});
