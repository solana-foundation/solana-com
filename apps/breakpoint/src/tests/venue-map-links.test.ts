import { describe, expect, it } from "vitest";
import { parseVenueMapHash } from "@/lib/venue-map-links";

describe("venue map shared links", () => {
  it("decodes a zone id and ignores other section anchors", () => {
    expect(parseVenueMapHash("#venue-map/royal%2Dexchange")).toBe(
      "royal-exchange",
    );
    expect(parseVenueMapHash("#venue-map")).toBeNull();
    expect(parseVenueMapHash("#today/main-stage")).toBeNull();
  });

  it("ignores empty or malformed fragments without breaking the map", () => {
    expect(parseVenueMapHash("#venue-map/")).toBeNull();
    expect(parseVenueMapHash("#venue-map/%20")).toBeNull();
    expect(parseVenueMapHash("#venue-map/%E0%A4%A")).toBeNull();
  });
});
