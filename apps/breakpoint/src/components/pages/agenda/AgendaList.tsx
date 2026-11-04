"use client";

import type { CSSProperties, KeyboardEvent, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "@workspace/i18n/client";
import { accordionButtonClassName } from "@/components/AccordionButton";
import DisclosureIcon from "@/components/DisclosureIcon";
import {
  AGENDA_DAYS,
  MAIN_STAGE,
  type AgendaItem,
  type AgendaSpeaker,
} from "@/content/agenda/types";

const DEFAULT_DAY = "Day 1";
const ALL_ASSET_CLASSES = "all";
const LONDON_TIME_ZONE = "Europe/London";
const EYEBROW_TEXT_CLASS = "type-eyebrow uppercase";

/** Brand accents per asset class so a day's blocks read at a glance. */
const ASSET_CLASS_ACCENTS: Record<string, string> = {
  atoms: "border-yellow text-yellow",
  "commodities / energy": "border-yellow text-yellow",
  "credit & collateral": "border-blue text-blue",
  crypto: "border-green text-green",
  "equities & real estate": "border-purple text-purple",
  intelligence: "border-pink text-pink",
  machines: "border-pink text-pink",
  money: "border-green text-green",
  "nostalgia & nihilism": "border-white text-white",
  "sovereigns / nations": "border-yellow text-yellow",
  talent: "border-white text-white",
  "the ai stack": "border-pink text-pink",
  "tokenized equities": "border-purple text-purple",
};

type Translate = ReturnType<typeof useTranslations>;

function normalizeDay(day: string) {
  return day.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function dayAccent(day: string) {
  const normalized = normalizeDay(day);
  if (normalized.includes("day2")) return "#aa67fb";
  if (normalized.includes("day3")) return "#14f195";
  if (normalized.includes("pre")) return "#aa67fb";
  return "#3c91ff";
}

function daySortValue(day: string) {
  const index = AGENDA_DAYS.findIndex((candidate) => candidate.key === day);
  return index === -1 ? AGENDA_DAYS.length : index;
}

function dayDateLabel(day: string) {
  const date = AGENDA_DAYS.find((candidate) => candidate.key === day)?.date;
  if (!date) return undefined;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: LONDON_TIME_ZONE,
    weekday: "short",
  }).format(new Date(`${date}T12:00:00Z`));
}

function todayAgendaDay() {
  const today = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: LONDON_TIME_ZONE,
    year: "numeric",
  }).format(new Date());

  return AGENDA_DAYS.find((candidate) => candidate.date === today)?.key;
}

function stageSortValue(stage: string) {
  return stage === MAIN_STAGE ? 0 : 1;
}

function normalizeSearch(value: string | undefined) {
  return (value ?? "")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

function searchText(item: AgendaItem) {
  return normalizeSearch(
    [
      item.title,
      item.format,
      item.location,
      ...(item.assetClasses ?? []),
      ...item.speakers.flatMap((speaker) => [
        speaker.name,
        speaker.company,
        speaker.title,
      ]),
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function assetAccentClass(assetClass: string) {
  return (
    ASSET_CLASS_ACCENTS[assetClass.toLowerCase()] ?? "border-white text-white"
  );
}

function speakerAssociation(speaker: AgendaSpeaker) {
  return [speaker.title, speaker.company].filter(Boolean).join(", ");
}

/**
 * WAI-ARIA tabs: arrow keys move between tabs and select them, Home and End
 * jump to the ends, and only the selected tab sits in the page's tab order.
 */
function handleTabListKeyDown(
  event: KeyboardEvent<HTMLDivElement>,
  keys: string[],
  current: string,
  select: (_key: string) => void,
) {
  const currentIndex = Math.max(0, keys.indexOf(current));
  let nextIndex: number | null = null;

  switch (event.key) {
    case "ArrowRight":
    case "ArrowDown":
      nextIndex = (currentIndex + 1) % keys.length;
      break;
    case "ArrowLeft":
    case "ArrowUp":
      nextIndex = (currentIndex - 1 + keys.length) % keys.length;
      break;
    case "Home":
      nextIndex = 0;
      break;
    case "End":
      nextIndex = keys.length - 1;
      break;
    default:
      return;
  }

  event.preventDefault();
  const nextKey = keys[nextIndex];
  if (nextKey === undefined) return;

  select(nextKey);
  const tabs =
    event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
  tabs[nextIndex]?.focus();
}

function XIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
    >
      <path d="M13.93 10.62L21.47 2H19.68L13.14 9.49L7.91 2H1.88L9.79 13.34L1.88 22.39H3.67L10.58 14.47L16.1 22.39H22.13L13.93 10.62ZM11.48 13.42L10.68 12.3L4.3 3.33H7.05L12.19 10.56L12.99 11.69L19.68 21.12H16.93L11.48 13.42Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
    >
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowDownIcon() {
  return (
    <svg
      aria-hidden="true"
      width="8"
      height="4"
      viewBox="0 0 8 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
    >
      <path d="M0 0L4 4L8 0H0Z" fill="currentColor" />
    </svg>
  );
}

function AssetPill({ assetClass }: { assetClass: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center whitespace-nowrap border px-2xs py-4xs font-mono text-button-small uppercase tracking-[0.07rem] ${assetAccentClass(assetClass)}`}
      data-agenda-asset-class
    >
      {assetClass}
    </span>
  );
}

function SessionMeta({ item }: { item: AgendaItem }) {
  return (
    <div className="flex w-auto shrink-0 flex-col items-start justify-start gap-3xs md:w-[140px]">
      <p
        className={`${EYEBROW_TEXT_CLASS} w-full whitespace-nowrap`}
        style={{ color: "var(--agenda-accent)" }}
      >
        {item.time}
      </p>
      {item.duration && (
        <p
          className={`${EYEBROW_TEXT_CLASS} w-full whitespace-nowrap text-text-secondary`}
        >
          {item.duration}
        </p>
      )}
      {item.location && (
        <p className={`${EYEBROW_TEXT_CLASS} w-full text-white`}>
          {item.location}
        </p>
      )}
    </div>
  );
}

function SpeakerBlock({
  showLinks,
  speaker,
  t,
}: {
  showLinks: boolean;
  speaker: AgendaSpeaker;
  t: Translate;
}) {
  const association = speakerAssociation(speaker);

  return (
    <div className="flex min-w-0 flex-col items-start gap-4xs">
      <div className="flex items-center gap-2xs">
        <p className="type-paragraph-bold text-white">{speaker.name}</p>
        {showLinks && speaker.xUrl && (
          <a
            href={speaker.xUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={t("onX", { name: speaker.name })}
            className="flex size-6 items-center justify-center text-white transition-opacity hover:opacity-70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={(event) => event.stopPropagation()}
          >
            <XIcon />
          </a>
        )}
      </div>
      {association && (
        <p
          className={`${EYEBROW_TEXT_CLASS} text-[length:var(--text-button)]! tracking-[var(--text-button--letter-spacing)]! text-text-secondary`}
        >
          {speaker.isModerator && (
            <span className="text-white">{t("moderator")} · </span>
          )}
          {association}
        </p>
      )}
    </div>
  );
}

function SessionRow({
  item,
  onToggle,
  open,
  t,
}: {
  item: AgendaItem;
  onToggle: () => void;
  open: boolean;
  t: Translate;
}) {
  const hasLinks = item.speakers.some((speaker) => speaker.xUrl);
  const hasDetails = Boolean(item.description || item.format || hasLinks);
  const detailsId = `agenda-${item.id}-details`;
  const assetClasses = item.assetClasses ?? [];

  return (
    <article
      className={`group/accordion-control relative flex w-full items-start gap-xs border border-neutral-700 p-xs text-left md:gap-s md:py-s md:pl-s md:pr-l ${
        open ? "bg-neutral-800 md:pb-l" : "bg-black"
      } ${hasDetails ? "cursor-pointer" : ""}`}
      onClick={hasDetails ? onToggle : undefined}
      data-agenda-session
    >
      <div className="flex min-w-0 flex-1 flex-col gap-s md:flex-row md:gap-3xl">
        <SessionMeta item={item} />

        <div className="flex min-w-0 flex-1 flex-col items-start gap-s md:pr-l">
          <div className="flex w-full flex-col items-start gap-2xs">
            <div className="flex w-full flex-col items-start gap-2xs md:flex-row md:items-start md:justify-between md:gap-m">
              {assetClasses.length > 0 && (
                <div className="flex flex-wrap gap-3xs md:order-last md:justify-end">
                  {assetClasses.map((assetClass) => (
                    <AssetPill key={assetClass} assetClass={assetClass} />
                  ))}
                </div>
              )}
              <h2 className="type-h5 min-w-0 flex-1 text-white">
                {item.title}
              </h2>
            </div>

            {item.speakers.length > 0 && (
              <div className="flex w-full flex-col items-start gap-2xs md:flex-row md:flex-wrap md:gap-x-l md:gap-y-2xs">
                {item.speakers.map((speaker) => (
                  <SpeakerBlock
                    key={`${item.id}-${speaker.name}-${speaker.company ?? ""}`}
                    showLinks={open}
                    speaker={speaker}
                    t={t}
                  />
                ))}
              </div>
            )}
          </div>

          {open && hasDetails && (
            <div
              id={detailsId}
              className="flex w-full flex-col items-start gap-s"
            >
              {item.format && (
                <p className={`${EYEBROW_TEXT_CLASS} text-white`}>
                  {item.format}
                </p>
              )}
              {item.description && (
                <p className="type-paragraph w-full max-w-[880px] whitespace-pre-line text-white">
                  {item.description}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {hasDetails && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={open ? detailsId : undefined}
          aria-label={t(open ? "collapse" : "expand", { title: item.title })}
          onClick={(event) => {
            event.stopPropagation();
            onToggle();
          }}
          className={`${accordionButtonClassName(open, "group")} self-start`}
        >
          <DisclosureIcon open={open} />
        </button>
      )}
    </article>
  );
}

function StaticRow({ item }: { item: AgendaItem }) {
  return (
    <article
      className="flex w-full overflow-hidden bg-[var(--agenda-accent)] p-xs text-black md:items-center md:justify-between md:px-s md:py-xl"
      data-agenda-static
    >
      <div className="flex min-w-0 flex-1 flex-col gap-m uppercase md:flex-row md:items-center md:gap-3xl">
        <div className="flex w-[140px] shrink-0 flex-col items-start justify-center gap-3xs">
          <p className={`${EYEBROW_TEXT_CLASS} w-full`}>{item.time}</p>
          {item.duration && (
            <p className={`${EYEBROW_TEXT_CLASS} w-full`}>{item.duration}</p>
          )}
        </div>
        <h2 className="type-h2 min-w-0 flex-1">{item.title}</h2>
      </div>
    </article>
  );
}

function SelectControl({
  children,
  id,
  label,
  onChange,
  value,
}: {
  children: ReactNode;
  id: string;
  label: string;
  onChange: (_value: string) => void;
  value: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex w-full min-w-0 flex-col justify-center gap-2xs md:w-auto"
    >
      <span className="type-button text-text-secondary">{label}</span>
      <span className="relative block w-full md:w-[280px]">
        <select
          id={id}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="type-button h-10 w-full appearance-none overflow-hidden border border-neutral-700 bg-black pb-2 pl-4 pr-10 pt-2 text-white outline-none focus:border-white"
        >
          {children}
        </select>
        <ArrowDownIcon />
      </span>
    </label>
  );
}

function SearchControl({
  id,
  label,
  onChange,
  placeholder,
  value,
}: {
  id: string;
  label: string;
  onChange: (_value: string) => void;
  placeholder: string;
  value: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex w-full min-w-0 flex-col justify-center gap-2xs md:w-auto md:flex-1"
    >
      <span className="type-button text-text-secondary">{label}</span>
      <span className="relative block w-full md:max-w-[480px]">
        <SearchIcon />
        <input
          id={id}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
          className="font-mono text-button-small h-10 w-full border border-neutral-700 bg-black pl-10 pr-4 uppercase tracking-[0.07rem] text-white outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-text-secondary focus:border-white"
        />
      </span>
    </label>
  );
}

export default function AgendaList({ items }: { items: AgendaItem[] }) {
  const t = useTranslations("breakpoint.pages.schedule.list");
  const listRef = useRef<HTMLDivElement>(null);
  const pendingDayScrollRef = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const userPickedDayRef = useRef(false);

  const allDays = useMemo(() => {
    const days = new Set<string>();
    for (const item of items) days.add(item.day);
    if (days.size === 0) {
      for (const day of AGENDA_DAYS) {
        if (day.key !== "Pre-Event") days.add(day.key);
      }
    }

    return [...days].sort((a, b) => {
      const byKnownDay = daySortValue(a) - daySortValue(b);
      if (byKnownDay !== 0) return byKnownDay;
      return a.localeCompare(b);
    });
  }, [items]);

  const allStages = useMemo(() => {
    const stages = new Set<string>();
    for (const item of items) {
      if (item.location && item.variant !== "static") stages.add(item.location);
    }

    return [...stages].sort((a, b) => {
      const byKnownStage = stageSortValue(a) - stageSortValue(b);
      if (byKnownStage !== 0) return byKnownStage;
      return a.localeCompare(b);
    });
  }, [items]);

  const assetClassOptions = useMemo(() => {
    const classes = new Set<string>();
    for (const item of items) {
      for (const assetClass of item.assetClasses ?? []) classes.add(assetClass);
    }
    return [...classes].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const [activeDay, setActiveDay] = useState(() =>
    allDays.includes(DEFAULT_DAY) ? DEFAULT_DAY : (allDays[0] ?? DEFAULT_DAY),
  );
  const [activeStage, setActiveStage] = useState<string | null>(
    () => allStages[0] ?? null,
  );
  const [assetClass, setAssetClass] = useState(ALL_ASSET_CLASSES);
  const [query, setQuery] = useState("");
  const [openItemId, setOpenItemId] = useState<string | null>(null);

  // During the event, open on today's programme instead of Day 1.
  useEffect(() => {
    const today = todayAgendaDay();
    if (!today || userPickedDayRef.current || !allDays.includes(today)) return;
    setActiveDay(today);
  }, [allDays]);

  const scrollToScheduleTop = useCallback(() => {
    window.requestAnimationFrame(() => {
      const list = listRef.current;
      if (!list) return;

      const tabHeight = tabsRef.current?.getBoundingClientRect().height ?? 0;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      window.scrollTo({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        top: list.getBoundingClientRect().top + window.scrollY - tabHeight,
      });
    });
  }, []);

  const selectDay = (day: string) => {
    userPickedDayRef.current = true;
    if (day !== activeDay) pendingDayScrollRef.current = true;
    setActiveDay(day);
    setOpenItemId(null);

    if (day === activeDay) scrollToScheduleTop();
  };

  const selectStage = (stage: string) => {
    setActiveStage(stage);
    setOpenItemId(null);
  };

  useEffect(() => {
    if (!pendingDayScrollRef.current) return;

    pendingDayScrollRef.current = false;
    scrollToScheduleTop();
  }, [activeDay, scrollToScheduleTop]);

  const normalizedQuery = normalizeSearch(query);
  const filtering =
    normalizedQuery.length > 0 || assetClass !== ALL_ASSET_CLASSES;

  const matchesFilters = useCallback(
    (item: AgendaItem) => {
      if (item.variant === "static") return !filtering;
      if (
        assetClass !== ALL_ASSET_CLASSES &&
        !(item.assetClasses ?? []).includes(assetClass)
      ) {
        return false;
      }
      if (normalizedQuery && !searchText(item).includes(normalizedQuery)) {
        return false;
      }
      return true;
    },
    [assetClass, filtering, normalizedQuery],
  );

  const matchesStage = useCallback(
    (item: AgendaItem, stage: string | null) =>
      !stage || !item.location || item.location === stage,
    [],
  );

  const dayItems = useMemo(
    () =>
      items.filter((item) => item.day === activeDay && matchesFilters(item)),
    [activeDay, items, matchesFilters],
  );

  const visibleItems = useMemo(
    () =>
      dayItems
        .filter((item) => matchesStage(item, activeStage))
        .sort((a, b) => {
          if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
          return a.title.localeCompare(b.title);
        }),
    [activeStage, dayItems, matchesStage],
  );

  const stageCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const stage of allStages) {
      counts.set(
        stage,
        dayItems.filter(
          (item) => item.variant !== "static" && matchesStage(item, stage),
        ).length,
      );
    }
    return counts;
  }, [allStages, dayItems, matchesStage]);

  const matchesElsewhere = useMemo(() => {
    if (!filtering) return 0;
    return items.filter(
      (item) =>
        matchesFilters(item) &&
        (item.day !== activeDay || !matchesStage(item, activeStage)),
    ).length;
  }, [activeDay, activeStage, filtering, items, matchesFilters, matchesStage]);

  const accentStyle = {
    "--agenda-accent": dayAccent(activeDay),
  } as CSSProperties;

  const emptyMessage = (() => {
    if (filtering) {
      return activeStage
        ? t("noMatches", { day: activeDay, stage: activeStage })
        : t("noMatchesAnyStage", { day: activeDay });
    }
    return activeStage
      ? t("comingSoon", { day: activeDay, stage: activeStage })
      : t("comingSoonAnyStage", { day: activeDay });
  })();

  return (
    <section
      aria-label={t("sectionLabel")}
      className="bg-black"
      style={accentStyle}
    >
      {/*
        Sticks below the floating site navigation (12px offset + 48px tall)
        and sits beneath it in the stacking order so both stay usable.
      */}
      <div
        ref={tabsRef}
        className="sticky top-0 z-30 flex w-full flex-col bg-black pt-[72px]"
      >
        <div
          role="tablist"
          aria-label={t("dayTabs")}
          onKeyDown={(event) =>
            handleTabListKeyDown(event, allDays, activeDay, selectDay)
          }
          className="flex w-full items-end justify-start overflow-x-auto md:justify-center"
        >
          <div className="h-px w-xs shrink-0 bg-neutral-700 md:hidden" />
          <div className="flex min-w-max items-end">
            {allDays.map((day) => {
              const active = day === activeDay;
              const date = dayDateLabel(day);
              return (
                <button
                  key={day}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectDay(day)}
                  className={`flex flex-col items-start gap-3xs border-b px-xs pb-2xs normal-case transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:items-center md:px-m ${
                    active
                      ? "border-white text-white"
                      : "border-neutral-700 text-text-secondary hover:text-white"
                  }`}
                >
                  <span className="type-h5 normal-case">{day}</span>
                  {date && (
                    <span className="type-button-small font-normal text-text-secondary">
                      {date}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="hidden h-px min-w-0 flex-1 bg-white/15 md:block" />
        </div>

        {allStages.length > 1 && (
          <div
            role="tablist"
            aria-label={t("stageTabs")}
            onKeyDown={(event) =>
              handleTabListKeyDown(
                event,
                allStages,
                activeStage ?? "",
                selectStage,
              )
            }
            className="container mx-auto flex w-full items-center gap-3xs overflow-x-auto pb-xs pt-xs"
          >
            {allStages.map((stage) => {
              const active = stage === activeStage;
              const count = stageCounts.get(stage) ?? 0;
              return (
                <button
                  key={stage}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => selectStage(stage)}
                  className={`type-button flex h-10 shrink-0 items-center gap-2xs border px-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    active
                      ? "border-white bg-white text-black"
                      : "border-neutral-700 bg-black text-text-secondary hover:border-neutral-500 hover:text-white"
                  }`}
                >
                  {stage}
                  {filtering && (
                    <span
                      className={
                        active ? "text-neutral-600" : "text-neutral-500"
                      }
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div
        aria-label={t("filters")}
        className="container mx-auto flex w-full flex-col gap-s pt-m md:flex-row md:items-end md:gap-m"
      >
        <SelectControl
          id="agenda-asset-class"
          label={t("assetClass")}
          value={assetClass}
          onChange={setAssetClass}
        >
          <option value={ALL_ASSET_CLASSES}>{t("allAssetClasses")}</option>
          {assetClassOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </SelectControl>
        <SearchControl
          id="agenda-search"
          label={t("search")}
          placeholder={t("searchPlaceholder")}
          value={query}
          onChange={setQuery}
        />
        <p className="type-eyebrow text-[length:var(--text-button)]! tracking-[var(--text-button--letter-spacing)]! text-neutral-500 md:ml-auto md:pb-xs">
          {t("timezoneNote")}
        </p>
      </div>

      <div
        ref={listRef}
        className="container mx-auto flex w-full flex-col items-start gap-xs pb-3xl pt-m md:pt-l"
      >
        {visibleItems.length > 0 ? (
          visibleItems.map((item) =>
            item.variant === "static" ? (
              <StaticRow key={item.id} item={item} />
            ) : (
              <SessionRow
                key={item.id}
                item={item}
                open={openItemId === item.id}
                t={t}
                onToggle={() =>
                  setOpenItemId((current) =>
                    current === item.id ? null : item.id,
                  )
                }
              />
            ),
          )
        ) : (
          <div className="w-full border border-neutral-700 px-s py-l text-center">
            <p className="type-button-relaxed text-text-secondary">
              {emptyMessage}
            </p>
            {matchesElsewhere > 0 && (
              <p className="type-paragraph mt-2xs text-text-secondary">
                {t("matchesElsewhere", { count: matchesElsewhere })}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
