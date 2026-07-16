import { afterEach, describe, expect, it, vi } from "vitest";

import {
  rpcInfraOptions,
  rpcMethodOptions,
  rpcRegionOptions,
} from "@/app/[locale]/data/data-config";
import {
  buildRpcAvgLatencyQuery,
  buildRpcP95LatencyQuery,
  buildRpcSuccessRateQuery,
  getRpcLatencyFilterOptions,
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
  });

  it("exposes the reviewed RPC method filters", () => {
    const methods = new Set(rpcMethodOptions.map((option) => option.value));

    expect(methods.has("getBlock_archival")).toBe(true);
    expect(methods.has("getMultipleAccounts")).toBe(true);
    expect(methods.has("getSignaturesForAddress")).toBe(true);
    expect(methods.has("getTokenAccountsByOwner")).toBe(true);
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
