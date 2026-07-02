import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
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

  if (!event) return <></>;

  return (
    <Link
      className="link-unstyled group block text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
      target="_blank"
      rel={
        eventUrl && !eventUrl.includes("solana.com")
          ? "noopener noreferrer nofollow"
          : "noopener noreferrer"
      }
      to={eventUrl}
    >
      <div className="relative aspect-square overflow-hidden bg-white/[0.04]">
        <Image
          alt={event.img.alt || event.title}
          src={(event?.img?.primary as string) || defaultImg}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      </div>

      <div className="flex items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <p
            className="flex flex-wrap items-center gap-x-2 font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/50"
            suppressHydrationWarning
          >
            {event?.schedule?.from && (
              <FormattedDate
                date={event.schedule.from}
                format="MMM d"
                timezone={event.schedule.timezone}
              />
            )}
            {hasDifferentEndDay(event) && event.schedule.to && (
              <>
                <span>–</span>
                <FormattedDate
                  date={event.schedule.to}
                  format="MMM d"
                  timezone={event.schedule.timezone}
                />
              </>
            )}
          </p>
          <h3 className="mt-3 font-brand text-xl font-medium leading-[1.2] tracking-[-0.01em] text-white transition-opacity duration-200 group-hover:opacity-60">
            {event.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/45">
            <EventsSingleLocation event={event} />
          </p>
        </div>
        <ArrowUpRight
          aria-hidden
          className="mt-1 h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
};

export default EventsSingleCard;
