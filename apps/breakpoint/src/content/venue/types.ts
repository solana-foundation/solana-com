import type { CompanyId } from "@workspace/ecosystem-data";

/**
 * Coordinates are in the floor's own SVG units: `x` runs 0–1000 across the
 * floor image and `y` runs 0–`height`, where `height` is 1000 × image
 * height / image width. Both the floor image and the callout overlay share
 * that viewBox, so a point stays glued to the same spot at any size or zoom.
 */
export type MapPoint = {
  x: number;
  y: number;
};

export type FloorId = "ground" | "first";

export type FloorAccent = "blue" | "pink";

export type MapFloor = {
  id: FloorId;
  /** Brand accent used for the floor toggle, outline glow and markers. */
  accent: FloorAccent;
  /** Height of the overlay viewBox for a width of 1000 units. */
  height: number;
  /** Floor image under `public/img/venue`. */
  image: string;
  /** Intrinsic pixel size of `image`, used for `width`/`height` attributes. */
  imageSize: { width: number; height: number };
};

/** A named area with a numbered marker and an optional leader line. */
export type MapZone = {
  id: string;
  floor: FloorId;
  /** Marker number shown on the map and in the list, in display order. */
  number: number;
  name: string;
  /** One line under the name: what happens there. */
  description?: string;
  /** Booths, stages or services inside the zone, in reading order. */
  items?: string[];
  /** Where the numbered marker sits. */
  marker: MapPoint;
  /** Where the leader line ends; omit to put the marker on the spot. */
  target?: MapPoint;
  /** Amenity icons listed with the zone, e.g. coffee and food at The Kernel. */
  amenities?: AmenityType[];
};

export type AmenityType =
  | "cloak-room"
  | "coffee"
  | "drinks"
  | "exit"
  | "first-aid"
  | "food"
  | "info"
  | "lockers"
  | "lost-found"
  | "market"
  | "merch"
  | "nursing-room"
  | "prayer-room"
  | "restroom"
  | "smoking"
  | "stairs";

/** A single-icon marker for a service such as a restroom or first aid. */
export type MapAmenity = {
  id: string;
  floor: FloorId;
  type: AmenityType;
  /** Overrides the generic label for this type, e.g. "First aid reception". */
  label?: string;
  /** Draws only the first icon for a type that is normally a pair. */
  single?: boolean;
  position: MapPoint;
};

/** A sponsor activation shown as a logo pill on the floor. */
export type MapSponsor = {
  id: string;
  floor: FloorId;
  name: string;
  /** Company record in `@workspace/ecosystem-data`; supplies the details panel. */
  companyId: CompanyId;
  /** Logo under `public/img/venue/logos`; empty to use the company's Breakpoint logo. */
  logo: string;
  /** Logo aspect ratio (width / height) so the pill fits the artwork. */
  logoAspect: number;
  position: MapPoint;
  /** Zone the activation sits in, for search results and the details panel. */
  zoneId?: string;
};

export type VenueMapData = {
  floors: MapFloor[];
  zones: MapZone[];
  amenities: MapAmenity[];
  sponsors: MapSponsor[];
};

export type MapSelection =
  | { kind: "zone"; id: string }
  | { kind: "amenity"; id: string }
  | { kind: "sponsor"; id: string };
