import { describe, expect, it } from "vitest";

import {
  rpcInfraOptions,
  rpcMethodOptions,
  rpcRegionOptions,
} from "@/app/[locale]/data/data-config";
import {
  buildRpcAvgLatencyQuery,
  buildRpcP95LatencyQuery,
  buildRpcSuccessRateQuery,
  parseRpcLatencyQueryOptions,
} from "@/lib/rpc/server";

describe("RPC latency query options", () => {
  it("defaults infra and region to all and accepts the new method values", () => {
    const options = parseRpcLatencyQueryOptions(
      new URLSearchParams("method=getTransactionRecent"),
    );

    expect(options.infra).toBe("all");
    expect(options.method).toBe("getTransactionRecent");
    expect(options.region).toBe("all");
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
      "all",
      "tsw",
      "lat",
      "aws",
      "gcp",
    ]);
  });

  it("exposes all regions before concrete RPC region filters", () => {
    expect(rpcRegionOptions.map((option) => option.value)).toEqual([
      "all",
      "us-east4",
      "us-west2",
      "europe-west2",
      "europe-west3",
      "asia-northeast3",
      "asia-northeast1",
      "asia-southeast1",
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
    ).toBe("all");
  });

  it("accepts all-region source aliases and falls back for unknown regions", () => {
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("region=all")).region,
    ).toBe("all");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("region=.*")).region,
    ).toBe("all");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("region=us-east4"))
        .region,
    ).toBe("us-east4");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("region=unknown")).region,
    ).toBe("all");
  });
});

describe("RPC Prometheus queries", () => {
  it("threads the default all-infra and all-region regex matchers into latency queries", () => {
    expect(buildRpcAvgLatencyQuery()).toContain('infra=~".*"');
    expect(buildRpcAvgLatencyQuery()).toContain('region=~".*"');
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
    expect(buildRpcAvgLatencyQuery({ infra: "tsw" })).toContain(
      'infra=~"terraswitch"',
    );
    expect(buildRpcAvgLatencyQuery({ infra: "lat" })).toContain(
      'infra=~"latitude"',
    );
    expect(buildRpcAvgLatencyQuery({ infra: "aws" })).toContain('infra=~"aws"');
    expect(buildRpcAvgLatencyQuery({ infra: "gcp" })).toContain('infra=~"gcp"');
  });

  it("matches Grafana's AWS all-region filter shape", () => {
    const query = buildRpcP95LatencyQuery({
      infra: "aws",
      method: "getLatestBlockhash",
      region: "all",
    });

    expect(query).toContain('method="getLatestBlockhash"');
    expect(query).toContain('region=~".*"');
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
