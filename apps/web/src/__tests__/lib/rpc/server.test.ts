import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getRpcTimeframeOption,
  rpcInfraOptions,
  rpcMethodOptions,
  rpcRegionOptions,
  rpcTimeframeOptions,
} from "@/app/[locale]/data/data-config";
import {
  buildRpcAvgLatencyQuery,
  buildRpcP95LatencyQuery,
  buildRpcSuccessRateQuery,
  getRpcLatencyCacheKey,
  getRpcLatencyFilterOptions,
  getRpcLatencyMetricRows,
  parseRpcLatencyQueryOptions,
} from "@/lib/rpc/server";

describe("RPC latency query options", () => {
  it("defaults to TSW and its first available region", () => {
    const options = parseRpcLatencyQueryOptions(
      new URLSearchParams("method=getTransactionRecent"),
    );

    expect(options.infra).toBe("tsw");
    expect(options.method).toBe("getTransactionRecent");
    expect(options.region).toBe("us-west");
    expect(options.timeframe).toBe("6h");
  });

  it("exposes the requested time frames in display order", () => {
    expect(rpcTimeframeOptions.map((option) => option.value)).toEqual([
      "30m",
      "1h",
      "6h",
      "24h",
      "7d",
      "30d",
      "90d",
      "1y",
    ]);
  });

  it("accepts supported time frames and falls back for unknown values", () => {
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("timeframe=30m"))
        .timeframe,
    ).toBe("30m");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("timeframe=1y"))
        .timeframe,
    ).toBe("1y");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("timeframe=forever"))
        .timeframe,
    ).toBe("6h");
  });

  it("caps every time frame at 200 Prometheus range samples", () => {
    for (const option of rpcTimeframeOptions) {
      expect(
        Math.ceil(option.durationSeconds / option.stepSeconds),
      ).toBeLessThanOrEqual(200);
    }

    expect(getRpcTimeframeOption("30m").stepSeconds).toBe(60);
    expect(getRpcTimeframeOption("1y").stepSeconds).toBe(2 * 24 * 60 * 60);
  });

  it("exposes the reviewed RPC method filters", () => {
    const methods = new Set(rpcMethodOptions.map((option) => option.value));

    expect(methods.has("getBlock_archival")).toBe(true);
    expect(methods.has("getMultipleAccounts")).toBe(true);
    expect(methods.has("getSignaturesForAddress")).toBe(true);
    expect(methods.has("getTokenAccountsByOwner")).toBe(true);
    expect(methods.has("getTransaction_archival")).toBe(true);
    expect(methods.has("getTransactionRecent")).toBe(true);
  });

  it("exposes the reviewed RPC infrastructure filters in preference order", () => {
    expect(rpcInfraOptions.map((option) => option.value)).toEqual([
      "tsw",
      "lat",
      "aws",
      "gcp",
    ]);
  });

  it("exposes canonical cross-infrastructure regions without all", () => {
    expect(rpcRegionOptions.map((option) => option.value)).toEqual([
      "us-east",
      "us-west",
      "eu-central",
      "eu-west",
      "ap-northeast",
      "ap-southeast",
    ]);
  });

  it("accepts reviewed infra and falls back for unknown infra", () => {
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=tsw")).infra,
    ).toBe("tsw");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=terraswitch"))
        .infra,
    ).toBe("tsw");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=lat")).infra,
    ).toBe("lat");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=latitude")).infra,
    ).toBe("lat");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=aws")).infra,
    ).toBe("aws");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=gcp")).infra,
    ).toBe("gcp");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=unknown")).infra,
    ).toBe("tsw");
  });

  it("maps provider-specific regions to canonical regions", () => {
    expect(
      parseRpcLatencyQueryOptions(
        new URLSearchParams("infra=gcp&region=us-east4"),
      ).region,
    ).toBe("us-east");
    expect(
      parseRpcLatencyQueryOptions(
        new URLSearchParams("infra=aws&region=eu-west-1"),
      ).region,
    ).toBe("eu-west");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=lat&region=tyo"))
        .region,
    ).toBe("ap-northeast");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("region=unknown")).region,
    ).toBe("us-west");
  });
});

describe("RPC latency query ranges", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("uses the selected duration and sampling step for range queries", async () => {
    const nowSeconds = 1_800_000_000;
    const fetchMock = vi.fn().mockImplementation(
      async () =>
        new Response(
          JSON.stringify({
            status: "success",
            data: { result: [] },
          }),
          { status: 200 },
        ),
    );

    vi.spyOn(Date, "now").mockReturnValue(nowSeconds * 1000);
    vi.stubGlobal("fetch", fetchMock);

    await getRpcLatencyMetricRows(
      {
        baseUrl: "https://prometheus.example.com",
        token: "test-token",
      },
      { timeframe: "30m" },
    );

    const rangeUrls = fetchMock.mock.calls
      .map(([input]) => new URL(String(input)))
      .filter((url) => url.pathname.endsWith("/query_range"));

    expect(rangeUrls).toHaveLength(4);
    for (const url of rangeUrls) {
      expect(url.searchParams.get("start")).toBe(String(nowSeconds - 30 * 60));
      expect(url.searchParams.get("end")).toBe(String(nowSeconds));
      expect(url.searchParams.get("step")).toBe("60");
    }
  });
});

describe("RPC latency cache identity", () => {
  const config = {
    baseUrl: "https://prometheus.example.com",
    token: "test-token",
  };

  it("keeps each time frame in a distinct server cache entry", () => {
    const thirtyMinutes = getRpcLatencyCacheKey(config, {
      timeframe: "30m",
    });
    const oneYear = getRpcLatencyCacheKey(config, { timeframe: "1y" });

    expect(thirtyMinutes).not.toBe(oneYear);
    expect(thirtyMinutes).toContain("|30m|1800|60|");
    expect(oneYear).toContain("|1y|31536000|172800|");
  });

  it("returns a stable key for equivalent requests", () => {
    const options = {
      infra: "aws",
      method: "getSlot",
      region: "us-east",
      timeframe: "24h",
    } as const;

    expect(getRpcLatencyCacheKey(config, options)).toBe(
      getRpcLatencyCacheKey(config, options),
    );
  });
});

describe("RPC Prometheus queries", () => {
  it("threads the default TSW and canonical region into latency queries", () => {
    expect(buildRpcAvgLatencyQuery()).toContain('infra=~"tsw"');
    expect(buildRpcAvgLatencyQuery()).toContain('geo=~"us-west"');
    expect(buildRpcAvgLatencyQuery()).not.toContain("region=");
  });

  it("excludes failed requests from latency queries", () => {
    expect(buildRpcAvgLatencyQuery()).toContain('status="success"');
    expect(buildRpcP95LatencyQuery()).toContain('status="success"');
  });

  it("threads selected infra into percentile queries", () => {
    expect(buildRpcP95LatencyQuery({ infra: "lat" })).toContain(
      'infra=~"latitude"',
    );
    expect(buildRpcP95LatencyQuery({ infra: "lat" })).toContain(
      "histogram_quantile(0.95",
    );
  });

  it("maps dropdown infra values to source infra labels", () => {
    expect(buildRpcAvgLatencyQuery({ infra: "tsw" })).toContain('infra=~"tsw"');
    expect(buildRpcAvgLatencyQuery({ infra: "lat" })).toContain(
      'infra=~"latitude"',
    );
    expect(buildRpcAvgLatencyQuery({ infra: "aws" })).toContain('infra=~"aws"');
    expect(buildRpcAvgLatencyQuery({ infra: "gcp" })).toContain('infra=~"gcp"');
  });

  it("matches Grafana's AWS canonical-region filter shape", () => {
    const query = buildRpcP95LatencyQuery({
      infra: "aws",
      method: "getLatestBlockhash",
      region: "us-east",
    });

    expect(query).toContain('method="getLatestBlockhash"');
    expect(query).toContain('geo=~"us-east"');
    expect(query).toContain('infra=~"aws"');
    expect(query).toContain('status="success"');
  });

  it("computes success rate as success over all requests", () => {
    const query = buildRpcSuccessRateQuery({ infra: "aws" });

    expect(query).toContain("rpc_requests_total");
    expect(query).toContain('status="success"');
    expect(query).toContain('infra=~"aws"');
    expect(query).not.toContain("error_kind");
    expect(query).toContain("or on(provider) (0 *");
  });
});

describe("RPC filter options", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("derives infra-specific canonical regions in display order", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "success",
          data: {
            result: [
              { metric: { geo: "eu-west", infra: "tsw" }, value: [1, "1"] },
              { metric: { geo: "us-west", infra: "tsw" }, value: [1, "1"] },
              {
                metric: { geo: "ap-southeast", infra: "latitude" },
                value: [1, "1"],
              },
              {
                metric: { geo: "us-east", infra: "latitude" },
                value: [1, "1"],
              },
            ],
          },
        }),
        { status: 200 },
      ),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      getRpcLatencyFilterOptions({
        baseUrl: "https://prometheus.example.com",
        token: "test-token",
      }),
    ).resolves.toEqual({
      regionsByInfra: {
        tsw: ["us-west", "eu-west"],
        lat: ["us-east", "ap-southeast"],
        aws: [],
        gcp: [],
      },
    });

    const url = new URL(fetchMock.mock.calls[0][0]);

    expect(url.searchParams.get("query")).toBe(
      "count by (infra, geo) (rpc_up)",
    );
  });
});
