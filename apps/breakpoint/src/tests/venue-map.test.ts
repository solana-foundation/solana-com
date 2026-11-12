import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { getCompany } from "@workspace/ecosystem-data";
import {
  fitFloor,
  initialFloorScale,
  searchVenue,
  selectionPoint,
  transformToCenter,
} from "@/components/venue/map-utils";
import {
  AMENITIES,
  AMENITY_ICONS,
  AMENITY_PAIR_ICONS,
  FLOORS,
  SPONSORS,
  VENUE_MAP,
  ZONES,
} from "@/content/venue/map-data";
import type { AmenityType } from "@/content/venue/types";
import { resolveSponsorLogo } from "@/lib/sponsors";

const PUBLIC_DIR = path.resolve(__dirname, "../../public");

const amenityLabels = Object.fromEntries(
  Object.keys(AMENITY_ICONS).map((type) => [
    type,
    type.replace("-", " ").replace("lost found", "lost & found"),
  ]),
) as Record<AmenityType, string>;

describe("venue map data", () => {
  it("numbers zones once, in order, with unique ids", () => {
    const numbers = ZONES.map((zone) => zone.number);
    expect(numbers).toEqual(numbers.map((_, index) => index + 1));
    expect(new Set(ZONES.map((zone) => zone.id)).size).toBe(ZONES.length);
    expect(new Set(AMENITIES.map((a) => a.id)).size).toBe(AMENITIES.length);
    expect(new Set(SPONSORS.map((s) => s.id)).size).toBe(SPONSORS.length);
  });

  it("keeps every point on its floor", () => {
    const heights = Object.fromEntries(FLOORS.map((f) => [f.id, f.height]));
    const inside = (floor: string, point: { x: number; y: number }) =>
      point.x >= 0 &&
      point.x <= 1000 &&
      point.y >= 0 &&
      point.y <= heights[floor]!;

    for (const zone of ZONES) {
      expect(inside(zone.floor, zone.marker), zone.id).toBe(true);
      if (zone.target)
        expect(inside(zone.floor, zone.target), zone.id).toBe(true);
    }
    for (const amenity of AMENITIES) {
      expect(inside(amenity.floor, amenity.position), amenity.id).toBe(true);
    }
    for (const sponsor of SPONSORS) {
      expect(inside(sponsor.floor, sponsor.position), sponsor.id).toBe(true);
    }
  });

  it("points at assets that exist", () => {
    const files = [
      ...FLOORS.map((floor) => floor.image),
      ...Object.values(AMENITY_ICONS),
      ...Object.values(AMENITY_PAIR_ICONS),
      ...SPONSORS.map((sponsor) => sponsor.logo).filter(Boolean),
    ];
    for (const file of files) {
      expect(existsSync(path.join(PUBLIC_DIR, file)), file).toBe(true);
    }
  });

  it("names a company record for every sponsor pill", () => {
    for (const sponsor of SPONSORS) {
      const company = getCompany(sponsor.companyId);
      expect(company, sponsor.id).toBeDefined();
      expect(company?.profile?.links?.website, sponsor.id).toBeTruthy();
    }
  });

  it("resolves a logo for every company a zone description credits", () => {
    for (const zone of ZONES) {
      for (const logo of zone.sponsoredBy ?? []) {
        expect(resolveSponsorLogo(logo).src, zone.id).toBeTruthy();
      }
    }
  });

  it("links sponsor zones to real zones", () => {
    const zoneIds = new Set(ZONES.map((zone) => zone.id));
    for (const sponsor of SPONSORS) {
      if (sponsor.zoneId)
        expect(zoneIds.has(sponsor.zoneId), sponsor.id).toBe(true);
    }
  });
});

describe("fitFloor", () => {
  it("letterboxes a wide floor inside a square viewport", () => {
    const box = fitFloor({ height: 339 }, { width: 400, height: 400 });
    expect(box.width).toBe(400);
    expect(box.height).toBeCloseTo(135.6);
    expect(box.left).toBe(0);
    expect(box.top).toBeCloseTo(132.2);
  });

  it("pillarboxes when the viewport is wider than the floor", () => {
    const box = fitFloor({ height: 522 }, { width: 1000, height: 400 });
    expect(box.height).toBe(400);
    expect(box.width).toBeCloseTo(766.28, 1);
    expect(box.left).toBeCloseTo(116.86, 1);
  });

  it("centres a point under the viewport midpoint at the requested scale", () => {
    const viewport = { width: 800, height: 500 };
    const floor = { height: 522 };
    const point = { x: 500, y: 261 };
    const transform = transformToCenter(point, floor, viewport, 2);
    const box = fitFloor(floor, viewport);
    const px = (point.x / 1000) * box.width;
    const py = (point.y / 522) * box.height;
    expect(transform.positionX + px * 2).toBeCloseTo(400);
    expect(transform.positionY + py * 2).toBeCloseTo(250);
  });

  it("clamps the zoomed floor to the viewport edges", () => {
    const viewport = { width: 800, height: 500 };
    const floor = { height: 522 };
    const box = fitFloor(floor, viewport);
    // A point in the far corner cannot be centred without showing the void.
    const corner = transformToCenter({ x: 0, y: 0 }, floor, viewport, 2);
    expect(corner.positionX).toBe(0);
    expect(corner.positionY).toBe(0);
    const far = transformToCenter({ x: 1000, y: 522 }, floor, viewport, 2);
    expect(far.positionX).toBeCloseTo(800 - box.width * 2);
    expect(far.positionY).toBeCloseTo(500 - box.height * 2);
  });

  it("centres a floor that is smaller than the viewport", () => {
    const viewport = { width: 800, height: 500 };
    const floor = { height: 339 };
    const box = fitFloor(floor, viewport);
    const transform = transformToCenter({ x: 500, y: 170 }, floor, viewport, 1);
    expect(transform.positionX).toBe(0);
    expect(transform.positionY).toBeCloseTo((500 - box.height) / 2);
  });

  it("opens floors whole unless the strip is too thin to read", () => {
    // Wide first floor at phone width is a 121px strip: zoom, but gently.
    expect(
      initialFloorScale({ height: 339 }, { width: 358, height: 268 }),
    ).toBe(1.6);
    // Ground floor on a phone is tall enough to open whole.
    expect(
      initialFloorScale({ height: 522 }, { width: 358, height: 268 }),
    ).toBe(1);
    // Both floors open whole on desktop, including narrow windows.
    expect(
      initialFloorScale({ height: 339 }, { width: 700, height: 437 }),
    ).toBe(1);
    expect(
      initialFloorScale({ height: 522 }, { width: 1000, height: 625 }),
    ).toBe(1);
  });
});

describe("searchVenue", () => {
  it("finds zones by name and by what is inside them", () => {
    const byName = searchVenue(VENUE_MAP, "pitstop", amenityLabels);
    expect(byName[0]?.selection).toEqual({ kind: "zone", id: "the-pitstop" });

    const byItem = searchVenue(VENUE_MAP, "ecosystem", amenityLabels);
    expect(byItem[0]?.selection).toEqual({
      kind: "zone",
      id: "the-borough-block",
    });
    expect(byItem[0]?.detail).toBe("Ecosystem activations");
  });

  it("sends a stage sponsor to its zone and lists other sponsors directly", () => {
    const zelle = searchVenue(VENUE_MAP, "zelle", amenityLabels);
    expect(zelle[0]?.selection).toEqual({ kind: "zone", id: "main-stage" });

    const jito = searchVenue(VENUE_MAP, "jito", amenityLabels);
    expect(jito[0]?.selection).toEqual({ kind: "sponsor", id: "jito" });
  });

  it("collapses repeated amenities to one result per floor", () => {
    const restrooms = searchVenue(VENUE_MAP, "restroom", amenityLabels);
    expect(restrooms.map((r) => r.floor)).toEqual(["ground", "first"]);
  });

  it("returns nothing for an empty query", () => {
    expect(searchVenue(VENUE_MAP, "   ", amenityLabels)).toEqual([]);
  });

  it("zooms to a zone's target when it has a leader line", () => {
    expect(
      selectionPoint(VENUE_MAP, { kind: "zone", id: "the-pitstop" }),
    ).toEqual({ x: 618, y: 425 });
    expect(
      selectionPoint(VENUE_MAP, { kind: "zone", id: "main-stage" }),
    ).toEqual({ x: 150, y: 215 });
  });
});
