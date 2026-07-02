import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";

import Link from "../../utils/Link";
import EventsSingleLocation from "./EventsSingleLocation";
import FormattedDate from "../shared/FormattedDate";
import defaultImg from "../../../assets/events/solana-community-event.jpg";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

const hasDifferentEndDay = (event: CalendarEvent) => {
  if (!event.schedule.from || !event.schedule.to) return false;

  return (
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: event.schedule.timezone || "UTC",
    }).format(new Date(event.schedule.from)) !==
    new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      timeZone: event.schedule.timezone || "UTC",
    }).format(new Date(event.schedule.to))
  );
};

const EventsSingleRow = ({ event }: { event?: CalendarEvent }) => {
  const eventUrl =
    event?.platform === "external" ? event.key! : event?.rsvp || event?.lumaUrl;

  return event ? (
    <Link
      className="link-unstyled group flex min-h-[132px] items-stretch overflow-hidden rounded-lg border border-white/10 bg-black/25 text-white transition-colors duration-200 hover:border-[#14f195]/60 hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#80ecff]"
      target="_blank"
      rel={
        eventUrl && !eventUrl.includes("solana.com")
          ? "noopener noreferrer nofollow"
          : "noopener noreferrer"
      }
      to={eventUrl}
    >
      <div className="relative hidden w-[132px] shrink-0 overflow-hidden bg-[#111217] sm:block">
        <Image
          alt={event.img.alt || event.title}
          src={(event?.img?.primary as string) || defaultImg}
          fill
          sizes="132px"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
      </div>
      <div className="flex min-w-0 flex-1 items-start justify-between gap-4 p-4">
        <div className="min-w-0">
          <p
            className="mb-3 flex flex-wrap items-center gap-2 text-sm text-[#80ecff]"
            suppressHydrationWarning={true}
          >
            <CalendarDays aria-hidden className="h-4 w-4 shrink-0" />
            {event?.schedule?.from && (
              <FormattedDate
                date={event.schedule.from}
                format="E, MMM d"
                timezone={event.schedule.timezone}
              />
            )}
            {hasDifferentEndDay(event) && event.schedule.to && (
              <>
                <span className="mx-1">-</span>
                <FormattedDate
                  date={event.schedule.to}
                  format="E, MMM d"
                  timezone={event.schedule.timezone}
                />
              </>
            )}
          </p>
          <h3 className="mb-3 font-brand text-xl font-semibold leading-[1.2] text-white">
            {event.title}
          </h3>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm leading-[1.45] text-white/60">
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden className="h-4 w-4 text-[#14f195]" />
              <EventsSingleLocation event={event} />
            </span>
            {event.type && <span>{event.type}</span>}
          </div>
        </div>
        <ArrowUpRight
          aria-hidden
          className="mt-1 h-5 w-5 shrink-0 text-white/50 transition-colors duration-200 group-hover:text-[#14f195]"
        />
      </div>
    </Link>
  ) : (
    <></>
  );
};

export default EventsSingleRow;
