import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildGrpcConnectionQuery,
  buildGrpcDataQuery,
  getGrpcConfig,
  getGrpcFilters,
  getGrpcMetricRows,
  parseGrpcQueryOptions,
} from "@/lib/grpc/server";
import {
  grpcTimeframeOptions,
  isGrpcFiltersResponse,
  getGrpcCloudProviders,
} from "@/app/[locale]/data/grpc-config";
import {
  applyQueryUpdates,
  getDashboardDataUrl,
  parseTab,
} from "@/app/[locale]/data/dashboard-query";

const config = {
  url: "https://clickhouse.example.test:8443",
  database: "benchmark",
  user: "reader",
  password: "test-secret",
};
const now = Date.parse("2026-10-26T17:30:42Z");

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("gRPC benchmark", () => {
  it("bounds supported timeframes to retained summaries and defaults invalid filters", () => {
    expect(grpcTimeframeOptions.map((option) => option.value)).toEqual([
      "30m",
      "1h",
      "6h",
      "24h",
      "7d",
      "30d",
    ]);
    expect(
      parseGrpcQueryOptions(
        new URLSearchParams("timeframe=1y&stream=invalid&commitment=invalid"),
      ),
    ).toEqual({
      region: "all",
      cloudProvider: "all",
      stream: "transaction",
      commitment: "processed",
      timeframe: "6h",
    });
  });

  it("uses server-only credentials and only allows HTTP for local development", () => {
    for (const [key, value] of Object.entries({
      URL: config.url,
      DATABASE: config.database,
      USER: config.user,
      PASSWORD: config.password,
    })) {
      vi.stubEnv(`GRPC_BENCHMARK_CLICKHOUSE_${key}`, value);
    }
    expect(getGrpcConfig()).toEqual(config);
    vi.stubEnv(
      "GRPC_BENCHMARK_CLICKHOUSE_URL",
      "http://external.example.test:8123",
    );
    expect(getGrpcConfig()).toBeUndefined();
    vi.stubEnv("GRPC_BENCHMARK_CLICKHOUSE_URL", "http://localhost:8123");
    vi.stubEnv("NODE_ENV", "development");
    expect(getGrpcConfig()?.url).toBe("http://localhost:8123");
    vi.stubEnv("NODE_ENV", "production");
    expect(getGrpcConfig()).toBeUndefined();
  });

  it("merges event percentile states separately for buckets and the entire period", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              provider: "alchemy",
              timestamp: now / 1000 - 120,
              entire_period: 0,
              p50_ms: 1,
            },
            {
              provider: "alchemy",
              timestamp: now / 1000 - 60,
              entire_period: 0,
              p50_ms: 99,
            },
            { provider: "alchemy", timestamp: 0, entire_period: 1, p50_ms: 2 },
            { provider: "helius", timestamp: 0, entire_period: 1, p50_ms: 0 },
            {
              provider: "missed",
              timestamp: 0,
              entire_period: 1,
              p50_ms: null,
            },
          ],
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const options = parseGrpcQueryOptions(
      new URLSearchParams("region=FRA&timeframe=1h"),
    );
    const result = await getGrpcMetricRows(config, options, now);
    expect(
      result.rows
        .filter((row) => row.metricName === "gRPC P50 Lag Entire Period")
        .map((row) => [row.providerName, row.value]),
    ).toEqual([
      ["Alchemy", 2],
      ["Helius", 0],
    ]);
    expect(result.rows).toHaveLength(4);
    expect(result.rows[2].date).toBe("2026-10-26T17:30:00.000Z");

    const [url, init] = fetchMock.mock.calls[0];
    expect(url.searchParams.get("readonly")).toBe("2");
    expect(
      url.searchParams.get("output_format_json_quote_64bit_integers"),
    ).toBe("0");
    expect(url.searchParams.get("param_start")).toBe(
      String(Date.parse("2026-10-26T16:30:00Z") / 1000),
    );
    expect(url.searchParams.get("param_end")).toBe(
      String(Date.parse("2026-10-26T17:30:00Z") / 1000),
    );
    expect(url.searchParams.get("param_region")).toBe("FRA");
    expect(url.toString()).not.toContain(config.password);
    expect(init.body).toContain("GROUP BY GROUPING SETS");
    expect(init.body).toContain("quantilesTDigestIfMerge");
    expect(init.body).not.toContain("benchmark_event_lags");
  });

  it("keeps each percentile and average in its own trend and whole-period metric", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [
              {
                provider: "helius",
                timestamp: now / 1000 - 120,
                entire_period: 0,
                p50_ms: 0,
                p95_ms: 4,
                p99_ms: 12,
                p999_ms: 13,
                avg_ms: 2,
              },
              {
                provider: "helius",
                timestamp: 0,
                entire_period: 1,
                p50_ms: 0,
                p95_ms: 5,
                p99_ms: 15,
                p999_ms: 18,
                avg_ms: 3,
              },
            ],
          }),
        ),
      ),
    );

    const result = await getGrpcMetricRows(
      config,
      parseGrpcQueryOptions(new URLSearchParams()),
      now,
    );
    const metricValue = (metricName: string) =>
      result.rows.find((row) => row.metricName === metricName)?.value;
    expect(
      ["P50", "P95", "P99", "Avg"].flatMap((label) => [
        metricValue(`gRPC ${label} Lag`),
        metricValue(`gRPC ${label} Lag Entire Period`),
      ]),
    ).toEqual([0, 0, 4, 5, 12, 15, 2, 3]);
    expect(result.rows).toHaveLength(10);
    expect(
      result.rows
        .filter((row) => row.metricName.includes("P99.9"))
        .map((row) => row.value),
    ).toEqual([13, 18]);
  });

  it("returns missed counts for each bucket and the whole period, including providers with no deliveries", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          data: [
            {
              provider: "alchemy",
              timestamp: now / 1000 - 120,
              entire_period: 0,
              p50_ms: 1,
              missed_updates: 3,
            },
            {
              provider: "alchemy",
              timestamp: now / 1000 - 60,
              entire_period: 0,
              p50_ms: 2,
              missed_updates: 7,
            },
            {
              provider: "alchemy",
              timestamp: 0,
              entire_period: 1,
              p50_ms: 1.5,
              missed_updates: 10,
            },
            {
              provider: "helius",
              timestamp: 0,
              entire_period: 1,
              p50_ms: 0,
              missed_updates: 0,
            },
            {
              provider: "missed-only",
              timestamp: 0,
              entire_period: 1,
              p50_ms: null,
              missed_updates: 12,
            },
          ],
        }),
      ),
    );
    vi.stubGlobal("fetch", fetchMock);
    const result = await getGrpcMetricRows(
      config,
      parseGrpcQueryOptions(new URLSearchParams("region=all&cloud=Teraswitch")),
      now,
    );
    expect(
      result.rows
        .filter((row) => row.metricName === "gRPC Missed Updates")
        .map((row) => [row.providerName, row.value, row.unit]),
    ).toEqual([
      ["Alchemy", 10, "Count"],
      ["Helius", 0, "Count"],
      ["missed-only", 12, "Count"],
    ]);
    expect(
      result.rows
        .filter((row) => row.metricName === "gRPC Missed Updates Trend")
        .map((row) => row.value),
    ).toEqual([3, 7]);
    expect(
      result.rows.filter((row) => row.providerName === "missed-only"),
    ).toHaveLength(1);
    expect(
      result.rows.find((row) => row.metricName === "gRPC Missed Updates")?.date,
    ).toBe("2026-10-26T17:30:00.000Z");
    const [url, init] = fetchMock.mock.calls[0];
    expect(url.searchParams.get("param_cloudProvider")).toBe("Teraswitch");
    expect(init.body).toContain("toFloat64(sum(missed)) AS missed_updates");
    expect(init.body).toContain("HAVING sum(delivered) + sum(missed) > 0");
    expect(init.body).toContain(
      "if(sum(delivered) > 0, quantiles[4] / 1e6, NULL)",
    );
  });

  it("adds outage values and connection-only providers to gRPC data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((_url, init) =>
        Promise.resolve(
          new Response(
            JSON.stringify({
              data: init.body.includes("benchmark_connection_events")
                ? [
                    {
                      provider: "alchemy",
                      downtime: 0,
                      reconnects: 2,
                      timestamp: now / 1000 - 100.25,
                      entire_period: 2,
                    },
                    {
                      provider: "alchemy",
                      downtime: 90,
                      reconnects: 2,
                      timestamp: 0,
                      entire_period: 1,
                    },
                    {
                      provider: "offline",
                      downtime: 3600,
                      reconnects: 0,
                      timestamp: 0,
                      entire_period: 1,
                    },
                    {
                      provider: "alchemy",
                      downtime: 30,
                      reconnects: 1,
                      timestamp: now / 1000 - 120,
                      entire_period: 0,
                    },
                    {
                      provider: "alchemy",
                      downtime: 60,
                      reconnects: 1,
                      timestamp: now / 1000 - 60,
                      entire_period: 0,
                    },
                  ]
                : [
                    {
                      provider: "helius",
                      timestamp: 0,
                      entire_period: 1,
                      p50_ms: 0,
                    },
                  ],
            }),
          ),
        ),
      ),
    );
    const result = await getGrpcMetricRows(
      config,
      parseGrpcQueryOptions(new URLSearchParams()),
      now,
      true,
    );
    const connectionRows = result.rows.filter(
      (row) =>
        row.metricName === "gRPC Downtime" ||
        row.metricName === "gRPC Reconnects",
    );
    expect(
      connectionRows.map((row) => [row.providerName, row.unit, row.value]),
    ).toEqual([
      ["Helius", "Seconds", 0],
      ["Helius", "Count", 0],
      ["Alchemy", "Seconds", 90],
      ["Alchemy", "Count", 2],
      ["offline", "Seconds", 3600],
      ["offline", "Count", 0],
    ]);
    expect(
      result.rows
        .filter((row) => row.metricName === "gRPC Downtime Trend")
        .map((row) => row.value),
    ).toEqual([30, 60]);
    expect(
      result.rows
        .filter((row) => row.metricName === "gRPC Reconnects Trend")
        .map((row) => row.value),
    ).toEqual([1, 1]);
    const event = result.rows.find(
      (row) => row.metricName === "gRPC Reconnect Event",
    )!;
    expect(event.value).toBe(2);
    expect(event.date).toBe(new Date(now - 100_250).toISOString());
  });

  it("counts outages with a refused reconnect or lasting 10 seconds as downtime", () => {
    const query = buildGrpcConnectionQuery();

    expect(query).toContain(
      "NOT lagInFrame(connected, 1, true) OVER stream AS after_disconnect",
    );
    expect(query).toContain("max(after_disconnect) AS refused");
    expect(query).toContain(
      "WHERE (refused OR dateDiff('millisecond', start_utc, end_utc) >= 10000)",
    );
  });

  it("keeps region input parameterized and excludes stale or incomplete summaries", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ data: [] })));
    vi.stubGlobal("fetch", fetchMock);
    const region = "EWR' OR 1=1 --";
    await getGrpcMetricRows(
      config,
      { ...parseGrpcQueryOptions(new URLSearchParams()), region },
      now,
    );
    const [url, init] = fetchMock.mock.calls[0];
    expect(url.searchParams.get("param_region")).toBe(region);
    expect(init.body).not.toContain(region);
    const query = buildGrpcDataQuery();
    expect(query).toContain("argMax(commits.revision, commits.generation)");
    expect(query).toContain(
      "c.revision >= d.revision AND d.revision >= d.expected AND d.incomplete = 0",
    );
    expect(query).toContain(
      "groupArray(tuple(region, cloud_provider, bucket, generation))",
    );
  });

  it("discovers live filter values and normalizes provider labels", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            data: [
              {
                region: "FRA",
                cloud_provider: "AWS",
                provider: "helius",
                data_type: "slot",
                commitment: "finalized",
              },
              {
                region: "EWR",
                cloud_provider: "Teraswitch",
                provider: "alchemy",
                data_type: "transaction",
                commitment: "processed",
              },
            ],
          }),
        ),
      ),
    );
    const filters = await getGrpcFilters(config);
    expect(filters).toEqual({
      regions: ["EWR", "FRA"],
      cloudProviders: ["AWS", "Teraswitch"],
      cloudProvidersByRegion: { EWR: ["Teraswitch"], FRA: ["AWS"] },
      providers: ["Alchemy", "Helius"],
      streams: ["slot", "transaction"],
      commitments: ["finalized", "processed"],
    });
    expect(isGrpcFiltersResponse(filters)).toBe(true);
    expect(isGrpcFiltersResponse({ ...filters, regions: [42] })).toBe(false);
    expect(
      isGrpcFiltersResponse({
        ...filters,
        cloudProvidersByRegion: { EWR: [42] },
      }),
    ).toBe(false);
    expect(getGrpcCloudProviders(filters, "EWR")).toEqual(["Teraswitch"]);
    expect(getGrpcCloudProviders(filters, "all")).toEqual([
      "AWS",
      "Teraswitch",
    ]);
    expect(getGrpcCloudProviders(filters, "missing")).toEqual([]);
    expect(getGrpcCloudProviders(filters, "__proto__")).toEqual([]);
  });

  it("applies the cloud parameter to latency and connection metrics", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(new Response(JSON.stringify({ data: [] }))),
      );
    vi.stubGlobal("fetch", fetchMock);
    const cloud = "Teraswitch' OR 1=1 --";
    const options = parseGrpcQueryOptions(
      new URLSearchParams({ region: "all", cloud }),
    );
    await getGrpcMetricRows(config, options, now, true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    for (const [url, init] of fetchMock.mock.calls) {
      expect(url.searchParams.get("param_cloudProvider")).toBe(cloud);
      expect(init.body).toContain(
        "({cloudProvider:String} = 'all' OR cloud_provider = {cloudProvider:String})",
      );
      expect(init.body).not.toContain(cloud);
    }
  });

  it.each(["slot", "all"])(
    "uses the single slot stream in the finalized %s view",
    async (stream) => {
      const fetchMock = vi
        .fn()
        .mockImplementation(() =>
          Promise.resolve(new Response(JSON.stringify({ data: [] }))),
        );
      vi.stubGlobal("fetch", fetchMock);
      const options = parseGrpcQueryOptions(
        new URLSearchParams({ stream, commitment: "finalized" }),
      );
      await getGrpcMetricRows(config, options, now, true);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      for (const [url, init] of fetchMock.mock.calls) {
        expect(url.searchParams.get("param_stream")).toBe(stream);
        expect(url.searchParams.get("param_commitment")).toBe("finalized");
        expect(init.body).toContain(
          "((data_type = 'slot' AND commitment = 'processed') OR (data_type != 'slot' AND commitment = {commitment:String}))",
        );
      }
    },
  );

  it("does not expose ClickHouse response text when a query fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue(
          new Response("internal database details", { status: 500 }),
        ),
    );
    await expect(
      getGrpcMetricRows(
        config,
        parseGrpcQueryOptions(new URLSearchParams()),
        now,
      ),
    ).rejects.toThrow("gRPC benchmark query failed (500)");
  });

  it("routes the gRPC tab and preserves shareable filters with a separate provider scope", () => {
    expect(parseTab("grpc")).toBe("grpc");
    expect(parseTab("grpc-v2")).toBe("overview");
    const params = new URLSearchParams("tab=rpc&providers=Triton");
    applyQueryUpdates(
      params,
      {
        tab: "grpc",
        grpcRegion: "FRA",
        grpcCloudProvider: "Teraswitch",
        grpcStream: "account",
        grpcCommitment: "finalized",
      },
      ["Alchemy", "Helius"],
    );
    expect(params.get("providers")).toBeNull();
    expect(params.get("region")).toBe("FRA");
    expect(params.get("cloud")).toBe("Teraswitch");
    const defaultUrl = getDashboardDataUrl({
      activeTab: "grpc",
      rpcInfra: "tsw",
      range: { kind: "preset", days: 90 },
      rpcMethod: "getHealth",
      rpcRegion: "fra",
      rpcTimeframe: "1h",
    });
    expect(
      new URL(defaultUrl, "https://example.test").searchParams.get(
        "connections",
      ),
    ).toBe("1");
    expect(
      new URL(defaultUrl, "https://example.test").searchParams.get("region"),
    ).toBe("all");
    expect(params.get("stream")).toBe("account");
    expect(params.get("commitment")).toBe("finalized");
    expect(
      getDashboardDataUrl({
        activeTab: "grpc",
        rpcInfra: "tsw",
        range: { kind: "preset", days: 90 },
        rpcMethod: "getHealth",
        rpcRegion: "fra",
        rpcTimeframe: "1h",
        grpcRegion: "FRA",
        grpcCloudProvider: "Teraswitch",
        grpcStream: "account",
        grpcCommitment: "finalized",
      }),
    ).toBe(
      "/api/grpc/data?region=FRA&cloud=Teraswitch&stream=account&commitment=finalized&timeframe=1h&connections=1",
    );
    params.set("providers", "Helius");
    applyQueryUpdates(params, { tab: "grpc" }, ["Alchemy", "Helius"]);
    expect(params.get("providers")).toBe("Helius");
    expect(params.get("region")).toBe("FRA");
  });
});
