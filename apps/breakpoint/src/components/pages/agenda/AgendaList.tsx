"use client";

import type { CSSProperties, KeyboardEvent } from "react";
import { useMemo, useState } from "react";
import DisclosureIcon from "@/components/DisclosureIcon";
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
  return (
    <div className="flex w-[132px] shrink-0 flex-col items-start justify-center gap-2 font-mono text-[13px] font-normal uppercase leading-[1.3] tracking-[0.08em] md:text-[16px]">
      <p className="h-[17px] w-full text-[var(--agenda-accent)]">{item.time}</p>
      {item.duration && (
        <p className="h-[17px] w-full whitespace-nowrap text-text-secondary">
          {item.duration}
        </p>
      )}
      {item.location && (
        <p className="w-full whitespace-nowrap text-white">{item.location}</p>
      )}
    </div>
  );
}

function SpeakerBlock({ speaker }: { speaker: AgendaSpeaker }) {
  return (
    <div className="flex min-w-[150px] flex-col items-start justify-center gap-2">
      <p className="w-full font-sans text-[18px] font-bold leading-[1.45] tracking-normal text-white">
        {speaker.name}
      </p>
      {speaker.company && (
        <p className="w-full font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
          {speaker.company}
        </p>
      )}
      {speaker.title && (
        <p className="w-full font-mono text-[14px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-text-secondary md:text-[16px]">
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
      className={`flex w-full cursor-pointer items-start justify-between gap-4 overflow-hidden border border-neutral-700 px-4 py-5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:pl-6 md:pr-12 ${
        open ? "bg-neutral-800 pb-12 md:py-6 md:pb-12" : "bg-black md:py-6"
      }`}
    >
      <div
        className={`flex min-w-0 flex-1 flex-col gap-6 pr-0 md:flex-row md:justify-center md:gap-24 md:pr-16 ${
          open ? "md:items-start" : "md:items-center"
        }`}
      >
        <SessionMeta item={item} />

        <div
          className={`flex min-w-0 flex-1 flex-col items-start md:pr-20 ${
            open && hasDetails ? "gap-8" : "gap-0"
          }`}
        >
          <div className="flex w-full flex-col items-start gap-3">
            <h2 className="w-full font-sans text-[24px] font-normal leading-[1.25] tracking-[-0.04em] text-white md:text-[32px]">
              {item.title}
            </h2>
            {item.tag && (
              <p className="w-full font-mono text-[13px] font-normal uppercase leading-[1.3] tracking-[0.08em] text-white md:text-[16px]">
                {item.tag}
              </p>
            )}
          </div>

          {open && item.description && (
            <p className="w-full max-w-[880px] font-sans text-[18px] font-normal leading-[1.45] tracking-normal text-white">
              {item.description}
            </p>
          )}

          {open && item.speakers.length > 0 && (
            <div className="flex w-full flex-wrap items-start gap-x-12 gap-y-8">
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

      <span
        className={`flex size-8 shrink-0 items-center justify-center ${
          open ? "bg-neutral-700" : "border border-neutral-700"
        }`}
      >
        <DisclosureIcon open={open} />
      </span>
    </article>
  );
}

function StaticRow({ item }: { item: AgendaItem }) {
  return (
    <article className="flex w-full items-center justify-between bg-[var(--agenda-accent)] px-6 py-12 text-black md:py-16">
      <div className="flex min-w-0 flex-1 flex-col gap-6 uppercase md:flex-row md:items-center md:gap-24">
        <div className="flex w-[132px] shrink-0 flex-col items-start justify-center gap-2 font-mono text-[13px] font-normal leading-[1.3] tracking-[0.08em] md:text-[16px]">
          <p className="h-[17px] w-full">{item.time}</p>
          {item.duration && <p className="h-[17px] w-full">{item.duration}</p>}
        </div>
        <h2 className="min-w-0 flex-1 font-display text-[36px] font-normal leading-[1.18] tracking-[0.04em] md:text-[64px]">
          {item.title}
        </h2>
      </div>
    </article>
  );
}

export default function AgendaList({ items }: { items: AgendaItem[] }) {
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
      <div className="flex w-full items-end justify-start overflow-x-auto pt-8 md:justify-center">
        <div className="flex min-w-max items-end">
          {allDays.map((day) => {
            const active = day === activeDay;
            return (
              <button
                key={day}
                type="button"
                onClick={() => {
                  setActiveDay(day);
                  setOpenItemId(null);
                }}
                className={`border-b px-6 pb-3 font-sans text-[24px] font-normal leading-[1.25] tracking-[-0.04em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:px-8 md:text-[32px] ${
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

      <div className="flex w-full flex-col items-start gap-4 px-5 pt-12 md:px-8">
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
          <div className="w-full border border-neutral-700 px-6 py-12 text-center">
            <p className="font-mono text-[14px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-text-secondary">
              Agenda details for this day are coming soon.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
