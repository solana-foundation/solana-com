import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  parseRawQuery,
  toCsv,
  verifyRawApiToken,
  RawQueryError,
} from "@/lib/rpc/raw";

const SECRET = "test-secret";

function mintToken(
  payload: Record<string, unknown>,
  secret = SECRET,
  header: Record<string, unknown> = { alg: "HS256", typ: "JWT" },
) {
  const encode = (value: Record<string, unknown>) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  const body = `${encode(header)}.${encode(payload)}`;
  const signature = createHmac("sha256", secret)
    .update(body)
    .digest("base64url");

  return `${body}.${signature}`;
}

const futureExp = Math.floor(Date.now() / 1000) + 3600;

describe("verifyRawApiToken", () => {
  it("accepts a valid token", () => {
    const token = mintToken({ sub: "chainstack", exp: futureExp });

    expect(verifyRawApiToken(token, SECRET)).toEqual({ sub: "chainstack" });
  });

  it("rejects a bad signature", () => {
    const token = mintToken({ sub: "chainstack", exp: futureExp }, "wrong");

    expect(verifyRawApiToken(token, SECRET)).toBeUndefined();
  });

  it("rejects an expired token", () => {
    const token = mintToken({
      sub: "chainstack",
      exp: Math.floor(Date.now() / 1000) - 1,
    });

    expect(verifyRawApiToken(token, SECRET)).toBeUndefined();
  });

  it("rejects missing sub or exp", () => {
    expect(
      verifyRawApiToken(mintToken({ exp: futureExp }), SECRET),
    ).toBeUndefined();
    expect(
      verifyRawApiToken(mintToken({ sub: "chainstack" }), SECRET),
    ).toBeUndefined();
  });

  it("rejects non-HS256 algorithms", () => {
    const token = mintToken({ sub: "chainstack", exp: futureExp }, SECRET, {
      alg: "none",
    });

    expect(verifyRawApiToken(token, SECRET)).toBeUndefined();
  });
});

describe("parseRawQuery", () => {
  it("applies defaults", () => {
    const query = parseRawQuery("latency", new URLSearchParams());

    expect(query.template).toBe("latency");
    expect(query.end - query.start).toBe(24 * 60 * 60);
    expect(query.step).toBe(180);
    expect(query.quantiles).toEqual([0.5, 0.95, 0.99]);
    expect(query.format).toBe("json");
  });

  it("rejects unknown templates, providers, and oversized ranges", () => {
    expect(() => parseRawQuery("promql", new URLSearchParams())).toThrow(
      RawQueryError,
    );
    expect(() =>
      parseRawQuery("latency", new URLSearchParams({ provider: "evil" })),
    ).toThrow(RawQueryError);
    expect(() =>
      parseRawQuery(
        "latency",
        new URLSearchParams({ start: "0", end: "999999999", step: "60" }),
      ),
    ).toThrow(RawQueryError);
  });

  it("rejects region without infra and infra filters on claim_checks", () => {
    expect(() =>
      parseRawQuery("latency", new URLSearchParams({ region: "fra" })),
    ).toThrow(RawQueryError);
    expect(() =>
      parseRawQuery("claim_checks", new URLSearchParams({ infra: "tsw" })),
    ).toThrow(RawQueryError);
  });
});

describe("toCsv", () => {
  it("renders point series", () => {
    const csv = toCsv([
      {
        labels: { provider: "helius", quantile: "0.99" },
        points: [[1755561600, 42.5]],
      },
    ]);

    expect(csv).toBe(
      "timestamp,provider,quantile,value\n2025-08-19T00:00:00.000Z,helius,0.99,42.5",
    );
  });

  it("renders win rate summaries", () => {
    const csv = toCsv([
      { labels: { provider: "helius" }, wins: 3, samples: 4, winPct: 75 },
    ]);

    expect(csv).toBe("provider,wins,samples,win_pct\nhelius,3,4,75");
  });
});
