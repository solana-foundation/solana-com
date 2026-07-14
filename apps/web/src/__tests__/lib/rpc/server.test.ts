import { describe, expect, it } from "vitest";

import {
  rpcInfraOptions,
  rpcMethodOptions,
} from "@/app/[locale]/data/data-config";
import {
  buildRpcAvgLatencyQuery,
  buildRpcP95LatencyQuery,
  buildRpcSuccessRateQuery,
  parseRpcLatencyQueryOptions,
} from "@/lib/rpc/server";

describe("RPC latency query options", () => {
  it("defaults infra to all and accepts the new method values", () => {
    const options = parseRpcLatencyQueryOptions(
      new URLSearchParams("method=getTransactionRecent"),
    );

    expect(options.infra).toBe("all");
    expect(options.method).toBe("getTransactionRecent");
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
      "latitude",
      "aws",
      "gcp",
    ]);
  });

  it("accepts reviewed infra and falls back for unknown infra", () => {
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=tsw")).infra,
    ).toBe("tsw");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=latitude")).infra,
    ).toBe("latitude");
    expect(
      parseRpcLatencyQueryOptions(new URLSearchParams("infra=lat")).infra,
    ).toBe("latitude");
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
});

describe("RPC Prometheus queries", () => {
  it("threads the default all-infra regex matcher into latency queries", () => {
    expect(buildRpcAvgLatencyQuery()).toContain('infra=~".*"');
  });

  it("excludes failed requests from latency queries", () => {
    expect(buildRpcAvgLatencyQuery()).toContain('status="success"');
    expect(buildRpcP95LatencyQuery()).toContain('status="success"');
  });

  it("threads selected infra into percentile queries", () => {
    expect(buildRpcP95LatencyQuery({ infra: "latitude" })).toContain(
      'infra=~"latitude"',
    );
    expect(buildRpcP95LatencyQuery({ infra: "latitude" })).toContain(
      "histogram_quantile(0.95",
    );
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
