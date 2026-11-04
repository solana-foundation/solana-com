"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  TransformComponent,
  TransformWrapper,
  type ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import { useTranslations } from "@workspace/i18n/client";
import { publicAssetPath } from "@/config";
import { VENUE_MAP } from "@/content/venue/map-data";
import type {
  AmenityType,
  FloorId,
  MapFloor,
  MapSelection,
  MapZone,
  VenueMapData,
} from "@/content/venue/types";
import MapOverlay from "./MapOverlay";
import MapSidebar from "./MapSidebar";
import {
  fitFloor,
  initialFloorScale,
  isSameSelection,
  selectionFloor,
  selectionPoint,
  transformToCenter,
} from "./map-utils";

const MIN_SCALE = 1;
const MAX_SCALE = 6;
const FOCUS_SCALE = 2.4;
const ANIMATION_MS = 450;
/** Markers shrink as the visitor zooms in so they never swallow the plan. */
const MARKER_ZOOM_DAMPING = 0.75;

const AMENITY_TYPES: AmenityType[] = [
  "cloak-room",
  "coffee",
  "drinks",
  "exit",
  "first-aid",
  "food",
  "info",
  "lockers",
  "lost-found",
  "market",
  "merch",
  "nursing-room",
  "prayer-room",
  "restroom",
  "smoking",
  "stairs",
];

const ACCENT_CLASSES: Record<
  MapFloor["accent"],
  { active: string; shadow: string }
> = {
  blue: {
    active: "border-core-blue bg-core-blue text-black",
    shadow: "drop-shadow(0 0 2px var(--color-core-blue))",
  },
  pink: {
    active: "border-core-pink bg-core-pink text-black",
    shadow: "drop-shadow(0 0 2px var(--color-core-pink))",
  },
};

type Size = { width: number; height: number };

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      setSize((current) =>
        current.width === rect.width && current.height === rect.height
          ? current
          : { width: rect.width, height: rect.height },
      );
    };

    update();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Below the desktop breakpoint the sidebar sits under the map. */
function sidebarIsBelowMap() {
  return (
    typeof window !== "undefined" &&
    !window.matchMedia("(min-width: 64.0625rem)").matches
  );
}

type InteractiveMapProps = {
  data?: VenueMapData;
  initialFloor?: FloorId;
};

export default function InteractiveMap({
  data = VENUE_MAP,
  initialFloor = "ground",
}: InteractiveMapProps) {
  const t = useTranslations("breakpoint.venue");
  const [activeFloorId, setActiveFloorId] = useState<FloorId>(initialFloor);
  const [selection, setSelection] = useState<MapSelection | null>(null);
  const [scale, setScale] = useState(1);
  const [viewportRef, viewport] = useElementSize<HTMLDivElement>();
  const transformRef = useRef<ReactZoomPanPinchRef>(null);

  const amenityLabels = useMemo(
    () =>
      Object.fromEntries(
        AMENITY_TYPES.map((type) => [type, t(`amenities.${type}`)]),
      ) as Record<AmenityType, string>,
    [t],
  );
  const floorLabels = useMemo(
    () =>
      Object.fromEntries(
        data.floors.map((floor) => [floor.id, t(`floors.${floor.id}`)]),
      ) as Record<FloorId, string>,
    [data.floors, t],
  );

  const activeFloor =
    data.floors.find((floor) => floor.id === activeFloorId) ?? data.floors[0]!;
  const box = fitFloor(activeFloor, viewport);
  const initialScale = initialFloorScale(activeFloor, viewport);
  const ready = box.width > 0;
  const unitsPerPx = ready
    ? 1000 / box.width / Math.pow(scale, MARKER_ZOOM_DAMPING)
    : 0;

  const zoneLabel = useCallback(
    (zone: MapZone) => t("marker", { number: zone.number, name: zone.name }),
    [t],
  );

  const zoomTo = useCallback(
    (point: { x: number; y: number }, floor: MapFloor) => {
      const instance = transformRef.current;
      if (!instance || viewport.width === 0) return;
      const focus = Math.min(
        MAX_SCALE,
        Math.max(FOCUS_SCALE, initialFloorScale(floor, viewport) * 1.4),
      );
      const target = transformToCenter(point, floor, viewport, focus);
      instance.setTransform(
        target.positionX,
        target.positionY,
        target.scale,
        prefersReducedMotion() ? 0 : ANIMATION_MS,
      );
    },
    [viewport],
  );

  const resetView = useCallback(() => {
    transformRef.current?.resetTransform(
      prefersReducedMotion() ? 0 : ANIMATION_MS,
    );
  }, []);

  const showMap = useCallback(() => {
    if (!sidebarIsBelowMap()) return;
    viewportRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "center",
    });
  }, [viewportRef]);

  const select = useCallback(
    (next: MapSelection | null) => {
      if (!next || isSameSelection(selection, next)) {
        setSelection(null);
        resetView();
        return;
      }

      const floorId = selectionFloor(data, next) ?? activeFloorId;
      const floor =
        data.floors.find((candidate) => candidate.id === floorId) ??
        activeFloor;
      const point = selectionPoint(data, next);

      setSelection(next);
      showMap();
      if (!point) return;
      if (floorId !== activeFloorId) {
        setActiveFloorId(floorId);
        // The new floor mounts its own pan/zoom instance on the next frame.
        window.requestAnimationFrame(() =>
          window.requestAnimationFrame(() => zoomTo(point, floor)),
        );
      } else {
        zoomTo(point, floor);
      }
    },
    [activeFloor, activeFloorId, data, resetView, selection, showMap, zoomTo],
  );

  const changeFloor = useCallback(
    (floorId: FloorId) => {
      if (floorId === activeFloorId) return;
      setActiveFloorId(floorId);
      if (selectionFloor(data, selection) !== floorId) setSelection(null);
    },
    [activeFloorId, data, selection],
  );

  // Keep the selection framed when the viewport is resized.
  useEffect(() => {
    const point = selectionPoint(data, selection);
    if (point && selectionFloor(data, selection) === activeFloorId) {
      zoomTo(point, activeFloor);
    }
    // Only re-run on viewport changes; selection changes zoom via `select`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewport.width, viewport.height]);

  const zoomStep = useCallback((direction: 1 | -1) => {
    const instance = transformRef.current;
    if (!instance) return;
    const duration = prefersReducedMotion() ? 0 : 250;
    if (direction === 1) instance.zoomIn(0.6, duration);
    else instance.zoomOut(0.6, duration);
  }, []);

  const controlClass =
    "flex size-10 items-center justify-center border border-stroke-secondary bg-black/80 text-white transition-colors hover:border-neutral-500 hover:bg-neutral-700 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white disabled:cursor-default disabled:text-neutral-600 disabled:hover:bg-black/80";

  return (
    <div className="flex flex-col gap-s md:grid md:grid-cols-12 md:items-start md:gap-s">
      <div className="flex flex-col gap-xs md:col-span-8">
        <div
          aria-label={t("floors.label")}
          className="flex gap-3xs"
          role="tablist"
        >
          {data.floors.map((floor) => {
            const active = floor.id === activeFloorId;
            return (
              <button
                key={floor.id}
                aria-selected={active}
                className={`h-10 border px-xs transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white ${
                  active
                    ? ACCENT_CLASSES[floor.accent].active
                    : "border-stroke-primary bg-transparent text-white hover:border-neutral-500 hover:bg-neutral-800"
                }`}
                onClick={() => changeFloor(floor.id)}
                role="tab"
                type="button"
              >
                {floorLabels[floor.id]}
              </button>
            );
          })}
        </div>

        <div
          ref={viewportRef}
          className="event-map-container relative aspect-[4/3] w-full overflow-hidden border border-stroke-primary bg-black min-[48rem]:aspect-[16/10]"
        >
          {ready && (
            <TransformWrapper
              key={`${activeFloor.id}:${viewport.width}x${viewport.height}`}
              ref={transformRef}
              centerOnInit
              centerZoomedOut
              doubleClick={{ disabled: true }}
              initialScale={initialScale}
              limitToBounds
              maxScale={MAX_SCALE}
              minScale={MIN_SCALE}
              onInit={(instance) => setScale(instance.state.scale)}
              onTransform={(_, state) => setScale(state.scale)}
              panning={{ velocityDisabled: true }}
              wheel={{ disabled: true }}
            >
              <TransformComponent
                contentClass="!block"
                wrapperClass="!h-full !w-full"
              >
                <div
                  className="relative"
                  style={{ width: box.width, height: box.height }}
                >
                  <img
                    alt={floorLabels[activeFloor.id]}
                    className="absolute inset-0 h-full w-full select-none"
                    draggable={false}
                    height={activeFloor.imageSize.height}
                    src={publicAssetPath(activeFloor.image)}
                    style={{
                      filter: ACCENT_CLASSES[activeFloor.accent].shadow,
                    }}
                    width={activeFloor.imageSize.width}
                  />
                  <MapOverlay
                    amenities={data.amenities.filter(
                      (amenity) => amenity.floor === activeFloor.id,
                    )}
                    amenityLabels={amenityLabels}
                    floor={activeFloor}
                    onSelect={select}
                    selection={selection}
                    sponsors={data.sponsors.filter(
                      (sponsor) => sponsor.floor === activeFloor.id,
                    )}
                    unitsPerPx={unitsPerPx}
                    zoneLabel={zoneLabel}
                    zones={data.zones.filter(
                      (zone) => zone.floor === activeFloor.id,
                    )}
                  />
                </div>
              </TransformComponent>
            </TransformWrapper>
          )}

          {/* Warm the cache for the other floor so switching is instant. */}
          {data.floors
            .filter((floor) => floor.id !== activeFloor.id)
            .map((floor) => (
              <img
                key={floor.id}
                alt=""
                aria-hidden="true"
                className="hidden"
                height={floor.imageSize.height}
                loading="lazy"
                src={publicAssetPath(floor.image)}
                width={floor.imageSize.width}
              />
            ))}

          <div className="absolute bottom-xs right-xs flex flex-col gap-3xs">
            <button
              aria-label={t("zoom.in")}
              className={controlClass}
              disabled={scale >= MAX_SCALE - 0.01}
              onClick={() => zoomStep(1)}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 16 16"
                width="16"
              >
                <path d="M8 2v12M2 8h12" />
              </svg>
            </button>
            <button
              aria-label={t("zoom.out")}
              className={controlClass}
              disabled={scale <= MIN_SCALE + 0.01}
              onClick={() => zoomStep(-1)}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 16 16"
                width="16"
              >
                <path d="M2 8h12" />
              </svg>
            </button>
            <button
              aria-label={t("zoom.reset")}
              className={controlClass}
              disabled={Math.abs(scale - initialScale) < 0.01}
              onClick={resetView}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="square"
                strokeWidth="1.5"
                viewBox="0 0 16 16"
                width="16"
              >
                <path d="M2 2h4M2 2v4M14 2h-4M14 2v4M2 14h4M2 14v-4M14 14h-4M14 14v-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <MapSidebar
        activeFloor={activeFloor}
        amenityLabels={amenityLabels}
        className="md:col-span-4"
        data={data}
        floorLabels={floorLabels}
        onFloorChange={changeFloor}
        onSelect={select}
        selection={selection}
      />
    </div>
  );
}
