"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AccordionButton from "@/components/AccordionButton";
import {
  AGENDA_DAY_TABS,
  type AgendaItem,
  type AgendaSpeaker,
} from "@/content/agenda/types";

const DEFAULT_DAY = "Day 1";

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
  const normalized = normalizeDay(day);
  if (normalized.includes("pre")) return 0;
  if (normalized.includes("day1")) return 1;
  if (normalized.includes("day2")) return 2;
  if (normalized.includes("day3")) return 3;
  return 99;
}

function SessionMeta({ item }: { item: AgendaItem }) {
  const textClasses = "type-eyebrow";

  return (
    <div className="type-eyebrow flex w-auto shrink-0 flex-col items-start justify-center gap-3xs md:w-[108px]">
      <p
        className={`h-[17px] w-full ${textClasses}`}
        style={{ color: "var(--agenda-accent)" }}
      >
        {item.time}
      </p>
      {item.duration && (
        <p
          className={`h-[17px] w-full whitespace-nowrap text-text-secondary ${textClasses}`}
        >
          {item.duration}
        </p>
      )}
      {item.location && (
        <p className={`w-full whitespace-nowrap text-white ${textClasses}`}>
          {item.location}
        </p>
      )}
    </div>
  );
}

function SpeakerBlock({ speaker }: { speaker: AgendaSpeaker }) {
  return (
    <div className="flex min-w-[150px] flex-col items-start justify-center gap-3xs">
      <p className="type-paragraph-bold w-full text-white">{speaker.name}</p>
      {speaker.company && (
        <p className="type-eyebrow w-full text-white">{speaker.company}</p>
      )}
      {speaker.title && (
        <p className="type-eyebrow w-full text-text-secondary">
          {speaker.title}
        </p>
      )}
    </div>
  );
}

function SessionRow({
  item,
  onToggle,
  open,
}: {
  item: AgendaItem;
  onToggle: () => void;
  open: boolean;
}) {
  const hasDetails = Boolean(item.description || item.speakers.length > 0);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onToggle();
  };

  return (
    <article
      role="button"
      tabIndex={0}
      aria-expanded={open}
      aria-label={`${open ? "Collapse" : "Expand"} ${item.title}`}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      className={`group/accordion-control relative flex w-full cursor-pointer items-start overflow-hidden border border-neutral-700 p-xs text-left focus-visible:outline-none md:justify-between md:gap-xs md:pl-s md:pr-l ${
        open ? "bg-neutral-800 md:py-s md:pb-l" : "bg-black md:py-s"
      }`}
    >
      <div
        className={`flex min-w-0 flex-1 flex-col gap-m md:flex-row md:justify-center md:gap-3xl md:pr-xl ${
          open ? "md:items-start" : "md:items-center"
        }`}
      >
        <SessionMeta item={item} />

        <div
          className={`flex min-w-0 flex-1 flex-col items-start md:pr-2xl ${
            open && hasDetails ? "gap-m" : "gap-0"
          }`}
        >
          <div className="flex w-full flex-col items-start gap-3xs md:gap-2xs">
            <h2 className="type-h5 w-full text-white">{item.title}</h2>
            {item.tag && (
              <p className="type-eyebrow w-full text-white">{item.tag}</p>
            )}
          </div>

          {open && item.description && (
            <p className="type-paragraph w-full max-w-[880px] text-white">
              {item.description}
            </p>
          )}

          {open && item.speakers.length > 0 && (
            <div className="flex w-full flex-col items-start gap-s md:flex-row md:flex-wrap md:gap-x-l md:gap-y-m">
              {item.speakers.map((speaker) => (
                <SpeakerBlock
                  key={`${item.id}-${speaker.name}-${speaker.company ?? ""}`}
                  speaker={speaker}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AccordionButton
        className={`absolute right-xs top-xs md:right-l ${
          open ? "md:top-s" : "md:top-1/2 md:-translate-y-1/2"
        }`}
        interaction="group"
        open={open}
      />
    </article>
  );
}

function StaticRow({ item }: { item: AgendaItem }) {
  const textClasses = "type-eyebrow";

  return (
    <article className="flex w-full overflow-hidden bg-[var(--agenda-accent)] p-xs text-black md:items-center md:justify-between md:px-s md:py-xl">
      <div className="flex min-w-0 flex-1 flex-col gap-m uppercase md:flex-row md:items-center md:gap-3xl">
        <div className="type-eyebrow flex w-[108px] shrink-0 flex-col items-start justify-center gap-3xs">
          <p className={`h-[17px] w-full ${textClasses}`}>{item.time}</p>
          {item.duration && (
            <p className={`h-[17px] w-full ${textClasses}`}>{item.duration}</p>
          )}
        </div>
        <h2 className="type-h2 min-w-0 flex-1">{item.title}</h2>
      </div>
    </article>
  );
}

export default function AgendaList({ items }: { items: AgendaItem[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const pendingDayScrollRef = useRef(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const allDays = useMemo(() => {
    const days = new Set<string>(AGENDA_DAY_TABS);
    for (const item of items) days.add(item.day);

    return [...days].sort((a, b) => {
      const byKnownDay = daySortValue(a) - daySortValue(b);
      if (byKnownDay !== 0) return byKnownDay;
      return a.localeCompare(b);
    });
  }, [items]);

  const [activeDay, setActiveDay] = useState(() => {
    if (items.some((item) => item.day === DEFAULT_DAY)) return DEFAULT_DAY;

    return (
      allDays.find((day) => items.some((item) => item.day === day)) ??
      DEFAULT_DAY
    );
  });
  const [openItemId, setOpenItemId] = useState<string | null>(null);

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
    if (day !== activeDay) pendingDayScrollRef.current = true;
    setActiveDay(day);
    setOpenItemId(null);

    if (day === activeDay) scrollToScheduleTop();
  };

  useEffect(() => {
    if (!pendingDayScrollRef.current) return;

    pendingDayScrollRef.current = false;
    scrollToScheduleTop();
  }, [activeDay, scrollToScheduleTop]);

  const visibleItems = useMemo(
    () =>
      items
        .filter((item) => item.day === activeDay)
        .sort((a, b) => {
          if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder;
          return a.title.localeCompare(b.title);
        }),
    [activeDay, items],
  );

  const accentStyle = {
    "--agenda-accent": dayAccent(activeDay),
  } as CSSProperties;

  return (
    <section
      aria-label="Breakpoint agenda"
      className="bg-black"
      style={accentStyle}
    >
      <div
        ref={tabsRef}
        className="sticky top-0 z-40 flex w-full items-end justify-start overflow-x-auto bg-black pt-m md:justify-center"
      >
        <div className="h-px w-xs shrink-0 bg-neutral-700 md:hidden" />
        <div className="flex min-w-max items-end">
          {allDays.map((day) => {
            const active = day === activeDay;
            return (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                className={`type-h5 border-b px-xs pb-2xs normal-case transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-m ${
                  active
                    ? "border-white text-white"
                    : "border-neutral-700 text-text-secondary hover:text-white"
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
        <div className="hidden h-px min-w-0 flex-1 bg-white/15 md:block" />
      </div>

      <div
        ref={listRef}
        className="flex w-full flex-col items-start gap-xs px-xs pt-m md:px-m md:pt-l"
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
              Agenda details for this day are coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
