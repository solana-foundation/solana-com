import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import Link from "../../utils/Link";
import EventsSingleLocation from "./EventsSingleLocation";
import FormattedDate from "../shared/FormattedDate";
import defaultImg from "../../../assets/events/solana-event.jpg";
import { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

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

const EventsSingleCard = ({ event }: { event?: CalendarEvent }) => {
  const eventUrl =
    event?.platform === "external" ? event.key! : event?.rsvp || event?.lumaUrl;

  return event ? (
    <Link
      className="link-unstyled group block h-full overflow-hidden rounded-lg border border-white/10 bg-white/[0.035] text-white transition-colors duration-200 hover:border-[#14f195]/60 hover:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#80ecff]"
      target="_blank"
      rel={
        eventUrl && !eventUrl.includes("solana.com")
          ? "noopener noreferrer nofollow"
          : "noopener noreferrer"
      }
      to={eventUrl}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#111217]">
        <Image
          alt={event.img.alt || event.title}
          src={(event?.img?.primary as string) || defaultImg}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {event?.schedule?.from && (
          <div className="absolute bottom-3 left-3 rounded-[4px] border border-white/15 bg-black/70 px-3 py-2 font-brand-mono text-xs uppercase text-white backdrop-blur">
            <FormattedDate
              date={event.schedule.from}
              format="MMM d"
              timezone={event.schedule.timezone}
            />
          </div>
        )}
      </div>
      <div className="flex min-h-[250px] flex-col justify-between p-5">
        <div>
          <div
            className="mb-4 flex flex-wrap gap-3 text-sm text-white/60"
            suppressHydrationWarning={true}
          >
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden className="h-4 w-4 text-[#80ecff]" />
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
            </span>
          </div>
          <h3 className="mb-4 font-brand text-2xl font-semibold leading-[1.18] text-white">
            {event.title}
          </h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-2 text-sm leading-[1.45] text-white/60">
            <MapPin
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-[#14f195]"
            />
            <EventsSingleLocation event={event} />
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4 font-brand-mono text-xs uppercase text-[#80ecff]">
            <span>{event.type || "Details"}</span>
            <ArrowUpRight
              aria-hidden
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </div>
        </div>
      </div>
    </Link>
  ) : (
    <></>
  );
};

export default EventsSingleCard;
