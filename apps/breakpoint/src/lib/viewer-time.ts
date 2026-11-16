import {
  formatInstantInZone,
  formatZoneName,
  sessionInstant,
  viewerTimeZoneDifference,
} from "@/lib/live-sessions";

/**
 * Local-time view of a London schedule for a visitor in another zone:
 * how far their clock is from London's, and session times on their clock.
 */
export type ViewerTimes = {
  /** Viewer's offset minus London's, in minutes; negative when behind. */
  differenceMinutes: number;
  /** City from the IANA zone, e.g. "New York". */
  place: string;
  /** Short zone name on the schedule date, e.g. "EST". */
  zoneName: string;
  /** False when the zone differs but the clocks agree, e.g. Lisbon. */
  showLocal: boolean;
  time(minutes: number): string;
  range(startMinutes: number, endMinutes: number): string;
};

export function viewerTimes(
  date: string,
  viewerTimeZone: string | null,
  locale: string,
): ViewerTimes | null {
  const noon = sessionInstant(date, 12 * 60);
  const difference = viewerTimeZoneDifference(viewerTimeZone, noon);
  if (!difference || !viewerTimeZone) return null;

  const time = (minutes: number) =>
    formatInstantInZone(sessionInstant(date, minutes), viewerTimeZone, locale);

  return {
    ...difference,
    zoneName: formatZoneName(noon, viewerTimeZone, locale),
    showLocal: difference.differenceMinutes !== 0,
    time,
    range: (startMinutes, endMinutes) =>
      `${time(startMinutes)}–${time(endMinutes)}`,
  };
}

/** "5 hours", "30 minutes" or "5 hours 30 minutes" in the viewer's language. */
export function formatOffsetDuration(minutes: number, locale: string): string {
  const total = Math.abs(minutes);
  const hours = Math.floor(total / 60);
  const rest = total % 60;
  const unit = (value: number, name: "hour" | "minute") => {
    try {
      return new Intl.NumberFormat(locale, {
        style: "unit",
        unit: name,
        unitDisplay: "long",
      }).format(value);
    } catch {
      return `${value} ${name}${value === 1 ? "" : "s"}`;
    }
  };
  const parts: string[] = [];
  if (hours > 0) parts.push(unit(hours, "hour"));
  if (rest > 0 || parts.length === 0) parts.push(unit(rest, "minute"));
  return parts.join(" ");
}
