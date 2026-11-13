import type {
  AmenityType,
  FloorId,
  MapAmenity,
  MapFloor,
  MapPoint,
  MapSelection,
  MapSponsor,
  MapZone,
  VenueMapData,
} from "@/content/venue/types";

export type Box = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** The largest box with the floor's aspect ratio that fits the viewport. */
export function fitFloor(
  floor: Pick<MapFloor, "height">,
  viewport: { width: number; height: number },
): Box {
  if (viewport.width <= 0 || viewport.height <= 0) {
    return { left: 0, top: 0, width: 0, height: 0 };
  }

  const ratio = 1000 / floor.height;
  const width = Math.min(viewport.width, viewport.height * ratio);
  const height = width / ratio;

  return {
    left: (viewport.width - width) / 2,
    top: (viewport.height - height) / 2,
    width,
    height,
  };
}

/** Converts a floor point into pixels inside the un-zoomed floor box. */
export function pointToBox(
  point: MapPoint,
  floor: Pick<MapFloor, "height">,
  box: Box,
) {
  return {
    x: (point.x / 1000) * box.width,
    y: (point.y / floor.height) * box.height,
  };
}

/**
 * Scale the floor opens at. Floors open whole; only a strip too thin to read
 * (the wide first floor at phone widths) opens zoomed a little, and the cap
 * keeps the whole floor in context.
 */
export function initialFloorScale(
  floor: Pick<MapFloor, "height">,
  viewport: { width: number; height: number },
  { minHeight = 160, max = 1.6 } = {},
): number {
  const box = fitFloor(floor, viewport);
  if (box.height <= 0 || box.height >= minHeight) return 1;
  return Math.min(viewport.height / box.height, max);
}

/**
 * Transform that centres `point` in the viewport at `scale`, clamped so the
 * floor image never leaves the viewport edges. The pan/zoom content is the
 * floor box itself (not the viewport), so the position is the box's
 * top-left offset after scaling; a box smaller than the viewport is centred.
 */
export function transformToCenter(
  point: MapPoint,
  floor: Pick<MapFloor, "height">,
  viewport: { width: number; height: number },
  scale: number,
) {
  const box = fitFloor(floor, viewport);
  const { x, y } = pointToBox(point, floor, box);
  const scaledWidth = box.width * scale;
  const scaledHeight = box.height * scale;

  const clamp = (wanted: number, scaled: number, size: number) =>
    scaled <= size
      ? (size - scaled) / 2
      : Math.min(0, Math.max(size - scaled, wanted));

  return {
    positionX: clamp(
      viewport.width / 2 - x * scale,
      scaledWidth,
      viewport.width,
    ),
    positionY: clamp(
      viewport.height / 2 - y * scale,
      scaledHeight,
      viewport.height,
    ),
    scale,
  };
}

export type SearchResult = {
  selection: MapSelection;
  floor: FloorId;
  title: string;
  /** The matched booth or detail when the title itself did not match. */
  detail?: string;
};

function includes(haystack: string | undefined, needle: string) {
  return Boolean(haystack && haystack.toLowerCase().includes(needle));
}

export function searchVenue(
  data: VenueMapData,
  query: string,
  amenityLabels: Record<AmenityType, string>,
  limit = 8,
): SearchResult[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const results: SearchResult[] = [];

  for (const zone of data.zones) {
    if (includes(zone.name, needle)) {
      results.push({
        selection: { kind: "zone", id: zone.id },
        floor: zone.floor,
        title: zone.name,
      });
      continue;
    }

    const detail =
      zone.items?.find((item) => includes(item, needle)) ??
      (includes(zone.description, needle) ? zone.description : undefined) ??
      zone.amenities
        ?.map((type) => amenityLabels[type])
        .find((label) => includes(label, needle));
    if (detail) {
      results.push({
        selection: { kind: "zone", id: zone.id },
        floor: zone.floor,
        title: zone.name,
        detail,
      });
    }
  }

  for (const sponsor of data.sponsors) {
    if (!includes(sponsor.name, needle)) continue;
    const zone = sponsor.zoneId
      ? data.zones.find((candidate) => candidate.id === sponsor.zoneId)
      : undefined;
    results.push({
      selection: zone
        ? { kind: "zone", id: zone.id }
        : { kind: "sponsor", id: sponsor.id },
      floor: sponsor.floor,
      title: sponsor.name,
      detail: zone?.name,
    });
  }

  const seenAmenityTypes = new Set<string>();
  for (const amenity of data.amenities) {
    const label = amenity.label ?? amenityLabels[amenity.type];
    if (!includes(label, needle)) continue;
    // One result per label and floor keeps "restroom" from filling the list.
    const key = `${amenity.floor}:${label}`;
    if (seenAmenityTypes.has(key)) continue;
    seenAmenityTypes.add(key);
    results.push({
      selection: { kind: "amenity", id: amenity.id },
      floor: amenity.floor,
      title: label,
    });
  }

  return results.slice(0, limit);
}

export function findSelection(
  data: VenueMapData,
  selection: MapSelection | null,
):
  | { kind: "zone"; item: MapZone }
  | { kind: "amenity"; item: MapAmenity }
  | { kind: "sponsor"; item: MapSponsor }
  | null {
  if (!selection) return null;

  if (selection.kind === "zone") {
    const item = data.zones.find((zone) => zone.id === selection.id);
    return item ? { kind: "zone", item } : null;
  }
  if (selection.kind === "amenity") {
    const item = data.amenities.find((amenity) => amenity.id === selection.id);
    return item ? { kind: "amenity", item } : null;
  }
  const item = data.sponsors.find((sponsor) => sponsor.id === selection.id);
  return item ? { kind: "sponsor", item } : null;
}

export function selectionFloor(
  data: VenueMapData,
  selection: MapSelection | null,
): FloorId | null {
  return findSelection(data, selection)?.item.floor ?? null;
}

export function selectionPoint(
  data: VenueMapData,
  selection: MapSelection | null,
): MapPoint | null {
  const found = findSelection(data, selection);
  if (!found) return null;
  if (found.kind === "zone") return found.item.target ?? found.item.marker;
  return found.item.position;
}

export function isSameSelection(
  a: MapSelection | null,
  b: MapSelection | null,
) {
  return a?.kind === b?.kind && a?.id === b?.id;
}
