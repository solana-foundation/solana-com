import { describe, expect, it } from "vitest";

import {
  DATA_API_METRICS_TTL_SECONDS,
  getEdgeMaxAgeSeconds,
  getPayloadAgeSeconds,
  MIN_EDGE_MAX_AGE_SECONDS,
} from "@/lib/databricks/cache-control";

const NOW = Date.parse("2026-10-14T12:00:00.000Z");
const HOUR = 60 * 60;

function generatedHoursAgo(hours: number) {
  return new Date(NOW - hours * HOUR * 1000).toISOString();
}

describe("getPayloadAgeSeconds", () => {
  it("measures whole seconds since generatedAt", () => {
    expect(getPayloadAgeSeconds(generatedHoursAgo(1), NOW)).toBe(HOUR);
  });

  it("clamps a future generatedAt to zero", () => {
    expect(getPayloadAgeSeconds(generatedHoursAgo(-1), NOW)).toBe(0);
  });

  it("returns undefined for an unparseable timestamp", () => {
    expect(getPayloadAgeSeconds("not a date", NOW)).toBeUndefined();
  });
});

describe("getEdgeMaxAgeSeconds", () => {
  it("gives a fresh payload the full data-api TTL", () => {
    expect(getEdgeMaxAgeSeconds(generatedHoursAgo(0), NOW)).toBe(
      DATA_API_METRICS_TTL_SECONDS,
    );
  });

  it("subtracts the payload's age so the edge expires when the payload turns 12h old", () => {
    expect(getEdgeMaxAgeSeconds(generatedHoursAgo(11), NOW)).toBe(HOUR);
  });

  it("floors the value once the payload is past data-api's TTL", () => {
    expect(getEdgeMaxAgeSeconds(generatedHoursAgo(25), NOW)).toBe(
      MIN_EDGE_MAX_AGE_SECONDS,
    );
  });

  it("treats an unparseable generatedAt as a fresh payload", () => {
    expect(getEdgeMaxAgeSeconds("garbage", NOW)).toBe(
      DATA_API_METRICS_TTL_SECONDS,
    );
  });

  it("honors a custom ttl", () => {
    expect(getEdgeMaxAgeSeconds(generatedHoursAgo(1), NOW, 2 * HOUR)).toBe(
      HOUR,
    );
  });
});
