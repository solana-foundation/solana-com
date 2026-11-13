"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { AgendaItem } from "@/content/agenda/types";
import type { LiveSchedule } from "@/lib/live-sessions";
import { useLiveSchedule, useViewerTimeZone } from "./use-live-schedule";

export type LiveScheduleValue = {
  schedule: LiveSchedule;
  now: number;
  /** IANA zone of the visitor's browser; null until mounted. */
  viewerTimeZone: string | null;
};

const LiveScheduleContext = createContext<LiveScheduleValue | null>(null);

/**
 * One live schedule shared by every section on the event-day home page, so
 * the stream hero, today's agenda and the venue map agree on what is on and
 * poll the agenda once between them.
 */
export function LiveScheduleProvider({
  allowClockPreview = false,
  children,
  initialItems,
  initialNow,
}: {
  /** Honour `?now=` to freeze the clock; off on the production deployment. */
  allowClockPreview?: boolean;
  children: ReactNode;
  initialItems: AgendaItem[];
  initialNow: number;
}) {
  const { schedule, now } = useLiveSchedule(initialItems, initialNow, {
    allowClockPreview,
  });
  const viewerTimeZone = useViewerTimeZone();

  return (
    <LiveScheduleContext.Provider value={{ now, schedule, viewerTimeZone }}>
      {children}
    </LiveScheduleContext.Provider>
  );
}

/** The live schedule, or null outside the live edition of the home page. */
export function useLiveScheduleContext() {
  return useContext(LiveScheduleContext);
}

/** The live schedule for components that only render in the live edition. */
export function useRequiredLiveSchedule(): LiveScheduleValue {
  const value = useContext(LiveScheduleContext);
  if (!value) {
    throw new Error("Live sections must render inside LiveScheduleProvider");
  }
  return value;
}
