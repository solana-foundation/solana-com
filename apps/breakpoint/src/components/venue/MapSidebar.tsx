"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { useLiveScheduleContext } from "@/components/sections/live/LiveScheduleProvider";
import {
  getSponsorSocialLinks,
  getSponsorTags,
} from "@/components/SponsorProfile";
import { publicAssetPath } from "@/config";
import { AMENITY_ICONS } from "@/content/venue/map-data";
import type {
  AmenityType,
  FloorId,
  MapFloor,
  MapSelection,
  MapSponsor,
  VenueMapData,
} from "@/content/venue/types";
import { followHashLink, stageSlug, todayHash } from "@/lib/live-links";
import {
  formatMinutes,
  sessionsForStage,
  stagesInSchedule,
  type LiveSession,
} from "@/lib/live-sessions";
import {
  findSelection,
  isSameSelection,
  searchVenue,
  type SearchResult,
} from "./map-utils";
import { sponsorCompany, sponsorLogoSrc } from "./sponsor-logo";

const BADGE_CLASSES: Record<MapFloor["accent"], string> = {
  blue: "bg-core-blue text-black",
  pink: "bg-core-pink text-black",
};

type MapSidebarProps = {
  activeFloor: MapFloor;
  amenityLabels: Record<AmenityType, string>;
  className?: string;
  data: VenueMapData;
  floorLabels: Record<FloorId, string>;
  onFloorChange: (floor: FloorId) => void;
  onSelect: (selection: MapSelection | null) => void;
  selection: MapSelection | null;
};

function AmenityIcon({
  className = "size-6",
  type,
}: {
  className?: string;
  type: AmenityType;
}) {
  return (
    <img
      alt=""
      aria-hidden="true"
      className={`${className} shrink-0`}
      height={24}
      src={publicAssetPath(AMENITY_ICONS[type])}
      width={24}
    />
  );
}

function NumberBadge({
  accent,
  number,
}: {
  accent: MapFloor["accent"];
  number: number;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex size-6 shrink-0 items-center justify-center font-mono text-button-small font-bold ${BADGE_CLASSES[accent]}`}
    >
      {number}
    </span>
  );
}

function SponsorLogo({
  className = "h-5",
  sponsor,
}: {
  className?: string;
  sponsor: MapSponsor;
}) {
  return (
    <img
      alt={sponsor.name}
      className={`${className} w-auto`}
      height={20}
      src={sponsorLogoSrc(sponsor)}
      width={Math.round(20 * sponsor.logoAspect)}
    />
  );
}

/**
 * What is on at a stage zone, from the live schedule when the home page is
 * in its live edition; null for other zones or outside the event.
 */
function stageProgramme(
  sessions: LiveSession[] | undefined,
  zoneName: string,
): {
  stage: string;
  current: LiveSession | null;
  next: LiveSession | null;
} | null {
  if (!sessions) return null;
  const wanted = stageSlug(zoneName);
  const stage = stagesInSchedule(sessions).find(
    (candidate) => stageSlug(candidate) === wanted,
  );
  if (!stage) return null;
  // Only the stage's own sessions; shared breaks belong to every tab.
  const own = sessionsForStage(sessions, stage).filter(
    (session) => session.location === stage,
  );
  return {
    stage,
    current: own.find((session) => session.status === "live") ?? null,
    next:
      own.find(
        (session) => session.status === "next" || session.status === "later",
      ) ?? null,
  };
}

function StageSession({
  accentClass,
  label,
  session,
}: {
  accentClass: string;
  label: string;
  session: LiveSession;
}) {
  return (
    <div className="flex flex-col gap-4xs">
      <p className={`type-eyebrow flex items-center gap-2xs ${accentClass}`}>
        <span aria-hidden="true" className="inline-flex size-2 bg-current" />
        {label}
      </p>
      <p className="type-eyebrow text-text-secondary">
        {formatMinutes(session.startMinutes)}–
        {formatMinutes(session.endMinutes)}
      </p>
      <p className="font-sans text-paragraph text-white">{session.title}</p>
    </div>
  );
}

function SponsorLogoButton({
  onSelect,
  selected,
  sponsor,
}: {
  onSelect: () => void;
  selected: boolean;
  sponsor: MapSponsor;
}) {
  return (
    <button
      aria-pressed={selected}
      className={`flex h-9 items-center border px-2xs transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white ${
        selected
          ? "border-white bg-neutral-800"
          : "border-stroke-primary hover:border-neutral-500 hover:bg-neutral-800"
      }`}
      onClick={onSelect}
      type="button"
    >
      <SponsorLogo className="h-[14px]" sponsor={sponsor} />
    </button>
  );
}

export default function MapSidebar({
  activeFloor,
  amenityLabels,
  className = "",
  data,
  floorLabels,
  onFloorChange,
  onSelect,
  selection,
}: MapSidebarProps) {
  const t = useTranslations("breakpoint.venue");
  const tSponsors = useTranslations("breakpoint.pages.sponsors");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const inputId = useId();
  const listId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(
    () => searchVenue(data, query, amenityLabels),
    [amenityLabels, data, query],
  );

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const pick = (result: SearchResult) => {
    if (result.floor !== activeFloor.id) onFloorChange(result.floor);
    onSelect(result.selection);
    setQuery("");
    setOpen(false);
  };

  const live = useLiveScheduleContext();
  const selected = findSelection(data, selection);
  const programme =
    selected?.kind === "zone"
      ? stageProgramme(live?.schedule.sessions, selected.item.name)
      : null;
  const selectedSponsor = selected?.kind === "sponsor" ? selected.item : null;
  const selectedCompany = selectedSponsor
    ? sponsorCompany(selectedSponsor)
    : null;
  const sponsorZone = selectedSponsor?.zoneId
    ? data.zones.find((zone) => zone.id === selectedSponsor.zoneId)
    : undefined;
  const floorSponsors = data.sponsors.filter(
    (sponsor) => sponsor.floor === activeFloor.id,
  );
  const accentFor = (floor: FloorId) =>
    data.floors.find((candidate) => candidate.id === floor)?.accent ?? "blue";
  const floorZones = data.zones
    .filter((zone) => zone.floor === activeFloor.id)
    .sort((a, b) => a.number - b.number);
  const floorAmenityTypes = [
    ...new Set(
      data.amenities
        .filter((amenity) => amenity.floor === activeFloor.id)
        .map((amenity) => amenity.type),
    ),
  ].sort((a, b) => amenityLabels[a].localeCompare(amenityLabels[b]));

  return (
    <aside className={`flex flex-col gap-xs ${className}`.trim()}>
      <div ref={containerRef} className="relative">
        <label className="sr-only" htmlFor={inputId}>
          {t("search.label")}
        </label>
        <input
          aria-autocomplete="list"
          aria-controls={listId}
          aria-expanded={open && query.trim().length > 0}
          autoComplete="off"
          className="h-12 w-full border border-stroke-primary bg-black px-xs pr-12 font-sans text-paragraph text-white placeholder:text-text-secondary focus:border-white focus:outline-none"
          id={inputId}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("search.placeholder")}
          role="combobox"
          type="search"
          value={query}
        />
        {query ? (
          <button
            aria-label={t("search.clear")}
            className="absolute right-xs top-1/2 -translate-y-1/2 text-text-secondary hover:text-white"
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
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
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        ) : (
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute right-xs top-1/2 -translate-y-1/2 text-text-secondary"
            fill="none"
            height="16"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 16 16"
            width="16"
          >
            <circle cx="7" cy="7" r="5" />
            <path d="M11 11l3 3" />
          </svg>
        )}

        {open && query.trim() && (
          <div
            className="absolute left-0 right-0 top-full z-20 mt-3xs max-h-80 overflow-y-auto border border-stroke-primary bg-black shadow-xl"
            id={listId}
            role="listbox"
          >
            {results.length === 0 ? (
              <p className="p-xs font-sans text-paragraph text-text-secondary">
                {t("search.noResults", { query: query.trim() })}
              </p>
            ) : (
              results.map((result) => {
                const zone =
                  result.selection.kind === "zone"
                    ? data.zones.find((z) => z.id === result.selection.id)
                    : undefined;
                const amenity =
                  result.selection.kind === "amenity"
                    ? data.amenities.find((a) => a.id === result.selection.id)
                    : undefined;
                return (
                  <button
                    key={`${result.selection.kind}:${result.selection.id}:${result.detail ?? ""}`}
                    aria-selected={isSameSelection(selection, result.selection)}
                    className="flex w-full items-start gap-2xs border-b border-stroke-primary px-xs py-2xs text-left normal-case transition-colors last:border-b-0 hover:bg-neutral-800"
                    onClick={() => pick(result)}
                    role="option"
                    type="button"
                  >
                    {zone ? (
                      <NumberBadge
                        accent={accentFor(zone.floor)}
                        number={zone.number}
                      />
                    ) : amenity ? (
                      <AmenityIcon type={amenity.type} />
                    ) : (
                      <span
                        aria-hidden="true"
                        className="inline-flex size-6 shrink-0 items-center justify-center border border-stroke-secondary font-mono text-button-small font-bold text-white"
                      >
                        S
                      </span>
                    )}
                    <span className="flex min-w-0 flex-col gap-4xs">
                      <span className="font-sans text-paragraph font-normal tracking-normal text-white">
                        {result.title}
                        <span className="text-text-secondary">
                          {" "}
                          · {floorLabels[result.floor]}
                        </span>
                      </span>
                      {result.detail && (
                        <span className="truncate font-sans text-2xs font-normal tracking-normal text-text-secondary">
                          {result.detail}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {selected ? (
        <div className="flex flex-col gap-s border border-stroke-primary p-xs md:p-s">
          <div className="flex items-start justify-between gap-xs">
            <div className="flex items-start gap-2xs">
              {selected.kind === "zone" ? (
                <NumberBadge
                  accent={accentFor(selected.item.floor)}
                  number={selected.item.number}
                />
              ) : selected.kind === "amenity" ? (
                <AmenityIcon type={selected.item.type} />
              ) : null}
              <div className="flex flex-col gap-4xs">
                {selected.kind === "sponsor" && (
                  <SponsorLogo className="mb-3xs h-6" sponsor={selected.item} />
                )}
                <h3 className="type-h5 text-white">
                  {selected.kind === "amenity"
                    ? (selected.item.label ?? amenityLabels[selected.item.type])
                    : selected.kind === "sponsor"
                      ? (selectedCompany?.name ?? selected.item.name)
                      : selected.item.name}
                </h3>
                <p className="type-eyebrow text-text-secondary">
                  {floorLabels[selected.item.floor]}
                  {selected.kind === "sponsor" &&
                    ` · ${sponsorZone ? t("details.inZone", { zone: sponsorZone.name }) : t("sponsorActivation")}`}
                </p>
              </div>
            </div>
            <button
              aria-label={t("details.close")}
              className="flex size-8 shrink-0 items-center justify-center border border-stroke-primary text-white transition-colors hover:bg-neutral-700"
              onClick={() => onSelect(null)}
              type="button"
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="14"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 16 16"
                width="14"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>

          {selectedSponsor && selectedCompany && (
            <>
              {(selectedCompany.profile?.summary ??
                selectedCompany.profile?.description ??
                selectedCompany.profile?.tagline) && (
                <p className="type-paragraph text-white">
                  {selectedCompany.profile?.summary ??
                    selectedCompany.profile?.description ??
                    selectedCompany.profile?.tagline}
                </p>
              )}
              {getSponsorTags(selectedCompany).length > 0 && (
                <div className="flex flex-wrap gap-3xs">
                  {getSponsorTags(selectedCompany).map((tag) => (
                    <span
                      key={tag}
                      className="border border-stroke-primary px-3xs py-3xs font-mono text-button-small font-bold uppercase text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {getSponsorSocialLinks(selectedCompany, tSponsors).length > 0 && (
                <ul
                  aria-label={t("details.links", {
                    name: selectedCompany.name,
                  })}
                  className="unstyled-list m-0 flex list-none flex-wrap items-center gap-s p-0"
                >
                  {getSponsorSocialLinks(selectedCompany, tSponsors).map(
                    (link) => (
                      <li key={link.label}>
                        <a
                          aria-label={`${selectedCompany.name} ${link.label}`}
                          className="inline-flex size-5 items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-white"
                          href={link.href}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {link.icon}
                        </a>
                      </li>
                    ),
                  )}
                </ul>
              )}
              {sponsorZone && (
                <button
                  className="self-start font-mono text-button-small font-bold uppercase text-white transition-colors hover:text-text-secondary"
                  onClick={() => onSelect({ kind: "zone", id: sponsorZone.id })}
                  type="button"
                >
                  {t("marker", {
                    number: sponsorZone.number,
                    name: sponsorZone.name,
                  })}
                </button>
              )}
            </>
          )}

          {selected.kind === "zone" && (
            <>
              {selected.item.description && (
                <p className="type-paragraph text-white">
                  {selected.item.description}
                </p>
              )}
              {programme && (
                <div className="flex flex-col gap-xs border-l-2 border-stroke-secondary pl-xs">
                  {programme.current && (
                    <StageSession
                      accentClass="text-core-green"
                      label={t("details.nowOnStage")}
                      session={programme.current}
                    />
                  )}
                  {programme.next && (
                    <StageSession
                      accentClass="text-core-purple"
                      label={t("details.nextOnStage")}
                      session={programme.next}
                    />
                  )}
                  <a
                    className="self-start font-mono text-button-small font-bold uppercase text-white transition-colors hover:text-text-secondary"
                    href={todayHash(programme.stage)}
                    onClick={() => followHashLink(todayHash(programme.stage))}
                  >
                    {t("details.todaySessions", { stage: programme.stage })}
                  </a>
                </div>
              )}
              {selected.item.items && selected.item.items.length > 0 && (
                <div className="flex flex-col gap-3xs">
                  <p className="type-eyebrow text-text-secondary">
                    {t("details.inside")}
                  </p>
                  <ul className="unstyled-list m-0 flex list-none flex-col gap-3xs p-0">
                    {selected.item.items.map((item) => (
                      <li
                        key={item}
                        className="type-paragraph border-l border-stroke-secondary pl-2xs text-white"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {data.sponsors.some(
                (sponsor) => sponsor.zoneId === selected.item.id,
              ) && (
                <div className="flex flex-col gap-3xs">
                  <p className="type-eyebrow text-text-secondary">
                    {t("details.poweredBy")}
                  </p>
                  <div className="flex flex-wrap items-center gap-3xs">
                    {data.sponsors
                      .filter((sponsor) => sponsor.zoneId === selected.item.id)
                      .map((sponsor) => (
                        <SponsorLogoButton
                          key={sponsor.id}
                          onSelect={() =>
                            onSelect({ kind: "sponsor", id: sponsor.id })
                          }
                          selected={false}
                          sponsor={sponsor}
                        />
                      ))}
                  </div>
                </div>
              )}
              {selected.item.amenities &&
                selected.item.amenities.length > 0 && (
                  <div className="flex flex-col gap-3xs">
                    <p className="type-eyebrow text-text-secondary">
                      {t("details.services")}
                    </p>
                    <ul className="unstyled-list m-0 flex list-none flex-wrap gap-xs p-0">
                      {selected.item.amenities.map((type) => (
                        <li
                          key={type}
                          className="flex items-center gap-3xs font-sans text-2xs text-white"
                        >
                          <AmenityIcon className="size-5" type={type} />
                          {amenityLabels[type]}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </>
          )}

          <button
            className="self-start font-mono text-button-small font-bold uppercase text-text-secondary transition-colors hover:text-white"
            onClick={() => onSelect(null)}
            type="button"
          >
            {t("details.back")}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-xs">
          <ul
            aria-label={t("list.heading", {
              floor: floorLabels[activeFloor.id],
            })}
            className="unstyled-list m-0 flex list-none flex-col border-t border-stroke-primary p-0"
          >
            {floorZones.map((zone) => (
              <li key={zone.id} className="border-b border-stroke-primary">
                <button
                  className="flex w-full items-center gap-2xs py-2xs pr-xs text-left normal-case transition-colors hover:bg-neutral-800 md:py-2xs"
                  onClick={() => onSelect({ kind: "zone", id: zone.id })}
                  type="button"
                >
                  <NumberBadge
                    accent={activeFloor.accent}
                    number={zone.number}
                  />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="font-sans text-paragraph font-normal tracking-normal text-white">
                      {zone.name}
                    </span>
                  </span>
                  {zone.amenities && zone.amenities.length > 0 && (
                    <span className="flex shrink-0 gap-4xs" aria-hidden="true">
                      {zone.amenities.slice(0, 3).map((type) => (
                        <AmenityIcon
                          key={type}
                          className="size-5"
                          type={type}
                        />
                      ))}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {floorSponsors.length > 0 && (
            <div className="flex flex-col gap-3xs">
              <p className="type-eyebrow text-text-secondary">
                {t("details.sponsors", { floor: floorLabels[activeFloor.id] })}
              </p>
              <div className="flex flex-wrap gap-3xs">
                {floorSponsors.map((sponsor) => (
                  <SponsorLogoButton
                    key={sponsor.id}
                    onSelect={() =>
                      onSelect({ kind: "sponsor", id: sponsor.id })
                    }
                    selected={false}
                    sponsor={sponsor}
                  />
                ))}
              </div>
            </div>
          )}

          {floorAmenityTypes.length > 0 && (
            <div className="flex flex-col gap-3xs">
              <p className="type-eyebrow text-text-secondary">
                {t("legend.heading")}
              </p>
              <ul className="unstyled-list m-0 grid list-none grid-cols-2 gap-x-xs gap-y-3xs p-0">
                {floorAmenityTypes.map((type) => {
                  const first = data.amenities.find(
                    (amenity) =>
                      amenity.floor === activeFloor.id && amenity.type === type,
                  );
                  return (
                    <li key={type}>
                      <button
                        className="flex w-full items-center gap-3xs text-left font-sans text-2xs font-normal normal-case tracking-normal text-text-secondary transition-colors hover:text-white"
                        onClick={() =>
                          first && onSelect({ kind: "amenity", id: first.id })
                        }
                        type="button"
                      >
                        <AmenityIcon className="size-5" type={type} />
                        {amenityLabels[type]}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}
