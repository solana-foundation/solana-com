"use client";

import type { KeyboardEvent } from "react";
import { publicAssetPath } from "@/config";
import { AMENITY_ICONS } from "@/content/venue/map-data";
import type {
  AmenityType,
  MapAmenity,
  MapFloor,
  MapSelection,
  MapSponsor,
  MapZone,
} from "@/content/venue/types";
import { isSameSelection } from "./map-utils";
import { sponsorLogoSrc } from "./sponsor-logo";

const ACCENT_VAR: Record<MapFloor["accent"], string> = {
  blue: "var(--color-core-blue)",
  pink: "var(--color-core-pink)",
};

type MapOverlayProps = {
  floor: MapFloor;
  zones: MapZone[];
  amenities: MapAmenity[];
  sponsors: MapSponsor[];
  selection: MapSelection | null;
  /** Floor units per CSS pixel, so markers keep a readable size at any width. */
  unitsPerPx: number;
  amenityLabels: Record<AmenityType, string>;
  zoneLabel: (zone: MapZone) => string;
  onSelect: (selection: MapSelection) => void;
};

function activate(onSelect: () => void) {
  return (event: KeyboardEvent<SVGGElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect();
  };
}

export default function MapOverlay({
  floor,
  zones,
  amenities,
  sponsors,
  selection,
  unitsPerPx: u,
  amenityLabels,
  zoneLabel,
  onSelect,
}: MapOverlayProps) {
  const accent = ACCENT_VAR[floor.accent];
  const markerRadius = 13 * u;
  const markerFont = 12 * u;
  const leaderWidth = 1.5 * u;
  const iconSize = 22 * u;
  const pillHeight = 18 * u;
  const pillPadding = 4 * u;
  // Shown only on keyboard focus, so pointer users see nothing extra.
  const focusRingClass =
    "pointer-events-none opacity-0 group-focus-visible:opacity-100";
  const focusRingWidth = 1.5 * u;
  const focusRingGap = 3 * u;

  return (
    <svg
      className="absolute inset-0 h-full w-full overflow-visible"
      viewBox={`0 0 1000 ${floor.height}`}
      role="group"
    >
      {sponsors.map((sponsor) => {
        const selected = isSameSelection(selection, {
          kind: "sponsor",
          id: sponsor.id,
        });
        const logoHeight = pillHeight - 2 * pillPadding;
        const logoWidth = logoHeight * sponsor.logoAspect;
        const width = logoWidth + 4 * pillPadding;
        const x = sponsor.position.x - width / 2;
        const y = sponsor.position.y - pillHeight / 2;
        const select = () => onSelect({ kind: "sponsor", id: sponsor.id });

        return (
          <g
            key={sponsor.id}
            aria-label={sponsor.name}
            aria-pressed={selected}
            className="group cursor-pointer outline-none"
            onClick={select}
            onKeyDown={activate(select)}
            role="button"
            tabIndex={0}
          >
            <rect
              fill={
                selected ? "var(--color-core-purple)" : "rgba(0, 0, 0, 0.85)"
              }
              height={pillHeight}
              rx={2 * u}
              stroke={selected ? accent : "rgba(255, 255, 255, 0.35)"}
              strokeWidth={u}
              width={width}
              x={x}
              y={y}
            />
            <image
              height={logoHeight}
              href={sponsorLogoSrc(sponsor)}
              preserveAspectRatio="xMidYMid meet"
              style={selected ? { filter: "invert(1)" } : undefined}
              width={logoWidth}
              x={x + 2 * pillPadding}
              y={y + pillPadding}
            />
            <rect
              className={focusRingClass}
              fill="none"
              height={pillHeight + 2 * focusRingGap}
              rx={3 * u}
              stroke="#fff"
              strokeWidth={focusRingWidth}
              width={width + 2 * focusRingGap}
              x={x - focusRingGap}
              y={y - focusRingGap}
            />
          </g>
        );
      })}

      {amenities.map((amenity) => {
        const selected = isSameSelection(selection, {
          kind: "amenity",
          id: amenity.id,
        });
        const label = amenity.label ?? amenityLabels[amenity.type];
        const select = () => onSelect({ kind: "amenity", id: amenity.id });
        const x = amenity.position.x - iconSize / 2;
        const y = amenity.position.y - iconSize / 2;

        return (
          <g
            key={amenity.id}
            aria-label={label}
            aria-pressed={selected}
            className="group cursor-pointer outline-none"
            onClick={select}
            onKeyDown={activate(select)}
            role="button"
            tabIndex={0}
          >
            {selected && (
              <circle
                className="event-map-callout-pulse"
                cx={amenity.position.x}
                cy={amenity.position.y}
                fill="none"
                r={iconSize / 2 + 4 * u}
                stroke={accent}
                strokeWidth={1.5 * u}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}
            <image
              height={iconSize}
              href={publicAssetPath(AMENITY_ICONS[amenity.type])}
              width={iconSize}
              x={x}
              y={y}
            />
            <circle
              className={focusRingClass}
              cx={amenity.position.x}
              cy={amenity.position.y}
              fill="none"
              r={iconSize / 2 + focusRingGap}
              stroke="#fff"
              strokeWidth={focusRingWidth}
            />
          </g>
        );
      })}

      {zones.map((zone) => {
        const selected = isSameSelection(selection, {
          kind: "zone",
          id: zone.id,
        });
        const { marker, target } = zone;
        const select = () => onSelect({ kind: "zone", id: zone.id });

        return (
          <g key={zone.id}>
            {target && (
              <>
                <path
                  d={`M ${marker.x} ${marker.y} L ${target.x} ${marker.y} L ${target.x} ${target.y}`}
                  fill="none"
                  stroke={accent}
                  strokeOpacity={selected ? 1 : 0.7}
                  strokeWidth={leaderWidth}
                />
                <circle cx={target.x} cy={target.y} fill={accent} r={2.5 * u} />
              </>
            )}
            <g
              aria-label={zoneLabel(zone)}
              aria-pressed={selected}
              className="group cursor-pointer outline-none"
              onClick={select}
              onKeyDown={activate(select)}
              role="button"
              tabIndex={0}
            >
              {selected && (
                <rect
                  className="event-map-callout-pulse"
                  fill="none"
                  height={markerRadius * 2 + 8 * u}
                  stroke={accent}
                  strokeWidth={1.5 * u}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "center",
                  }}
                  width={markerRadius * 2 + 8 * u}
                  x={marker.x - markerRadius - 4 * u}
                  y={marker.y - markerRadius - 4 * u}
                />
              )}
              <rect
                fill={selected ? "#fff" : accent}
                height={markerRadius * 2}
                stroke={selected ? accent : "#000"}
                strokeWidth={u}
                width={markerRadius * 2}
                x={marker.x - markerRadius}
                y={marker.y - markerRadius}
              />
              <text
                dominantBaseline="central"
                fill="#000"
                fontFamily="var(--font-abc-favorit-mono), monospace"
                fontSize={markerFont}
                fontWeight={700}
                textAnchor="middle"
                x={marker.x}
                y={marker.y + 0.5 * u}
              >
                {zone.number}
              </text>
              <rect
                className={focusRingClass}
                fill="none"
                height={markerRadius * 2 + 2 * focusRingGap}
                stroke="#fff"
                strokeWidth={focusRingWidth}
                width={markerRadius * 2 + 2 * focusRingGap}
                x={marker.x - markerRadius - focusRingGap}
                y={marker.y - markerRadius - focusRingGap}
              />
            </g>
          </g>
        );
      })}
    </svg>
  );
}
