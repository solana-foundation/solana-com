import { describe, expect, it } from "vitest";
import { VENUE_MAP } from "@/content/venue/map-data";
import {
  parseTodayHash,
  parseVenueMapHash,
  stageSlug,
  todayHash,
  venueMapHash,
  zoneForStage,
} from "@/lib/live-links";

describe("stageSlug", () => {
  it("lower-cases, hyphenates and drops a trailing 'Stage'", () => {
    expect(stageSlug("Main Stage")).toBe("main");
    expect(stageSlug("Royal Exchange Stage")).toBe("royal-exchange");
    expect(stageSlug("  Royal   Exchange ")).toBe("royal-exchange");
  });
});

describe("zoneForStage", () => {
  it("finds the map zone named after an agenda stage", () => {
    expect(zoneForStage(VENUE_MAP, "Main Stage")?.id).toBe("main-stage");
    expect(zoneForStage(VENUE_MAP, "Royal Exchange")?.id).toBe(
      "royal-exchange",
    );
  });

  it("tolerates case and a trailing 'Stage'", () => {
    expect(zoneForStage(VENUE_MAP, "main stage")?.id).toBe("main-stage");
    expect(zoneForStage(VENUE_MAP, "Royal Exchange Stage")?.id).toBe(
      "royal-exchange",
    );
  });

  it("returns undefined for stages that are not on the map", () => {
    expect(zoneForStage(VENUE_MAP, "Workshop Room")).toBeUndefined();
    expect(zoneForStage(VENUE_MAP, undefined)).toBeUndefined();
    expect(zoneForStage(VENUE_MAP, "")).toBeUndefined();
  });
});

describe("hash deep links", () => {
  it("round-trips a venue map zone", () => {
    const hash = venueMapHash("royal-exchange");
    expect(hash).toBe("#venue-map/royal-exchange");
    expect(parseVenueMapHash(hash)).toBe("royal-exchange");
  });

  it("round-trips a stage for today's agenda", () => {
    const hash = todayHash("Royal Exchange");
    expect(hash).toBe("#today/royal-exchange");
    expect(parseTodayHash(hash)).toBe("royal-exchange");
  });

  it("ignores other hashes and the bare anchors", () => {
    expect(parseVenueMapHash("#venue-map")).toBeNull();
    expect(parseVenueMapHash("#today/main")).toBeNull();
    expect(parseTodayHash("#today/")).toBeNull();
    expect(parseTodayHash("")).toBeNull();
  });
});
