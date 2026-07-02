import Image from "next/image";
import { ArrowUpRight, CalendarDays, MapPin } from "lucide-react";
import SocialShareButtons from "../sharedPageSections/SocialShareButtons";
import Button from "../shared/Button";
import FormattedDate from "../shared/FormattedDate";
import { useTranslations } from "next-intl";
import defaultImg from "../../../public/social/solana.jpg";
import { Link } from "@/utils/Link";
import { CalendarEvent } from "@/lib/events/fetchCalendarEvents";
import EventsSingleLocation from "./EventsSingleLocation";

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

const EventsDetailSection = ({
  event = null,
}: {
  event?: CalendarEvent | null;
}) => {
  const t = useTranslations();
  if (!event) return null;

  const eventUrl =
    event.platform === "external" ? event.key! : event.rsvp || event.lumaUrl!;
  const description =
    event.description && event.description !== event.title
      ? event.description
      : "Join Solana builders, founders, creators, and community members for the next ecosystem gathering.";

  return (
    <section className="my-0 grid grid-cols-1 overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] shadow-[0_24px_80px_rgba(0,0,0,0.28)] md:grid-cols-[0.95fr_1.05fr]">
      <div className="relative aspect-[4/3] min-h-[280px] md:aspect-auto md:min-h-[520px]">
        <Link
          target="_blank"
          rel={
            !eventUrl.includes("solana.com")
              ? "noopener noreferrer nofollow"
              : "noopener noreferrer"
          }
          to={eventUrl}
          className="group block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#80ecff]"
        >
          <Image
            alt={event.img.alt || event.title}
            src={(event?.img?.primary as string) || defaultImg}
            fill
            sizes="(min-width: 768px) 48vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
          <span className="absolute left-4 top-4 rounded-[4px] border border-white/15 bg-black/70 px-3 py-2 font-brand-mono text-xs uppercase text-white backdrop-blur">
            Featured
          </span>
        </Link>
      </div>
      <div className="flex min-w-[280px] flex-col justify-between gap-y-8 p-6 md:p-10">
        <div>
          <div className="mb-5 flex flex-wrap gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-[4px] border border-white/10 bg-black/20 px-3 py-2">
              <CalendarDays aria-hidden className="h-4 w-4 text-[#80ecff]" />
              {event?.schedule?.from && (
                <FormattedDate
                  date={event?.schedule?.from}
                  format="E, MMM d"
                  timezone={event?.schedule?.timezone}
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
            <span className="inline-flex items-center gap-2 rounded-[4px] border border-white/10 bg-black/20 px-3 py-2">
              <MapPin aria-hidden className="h-4 w-4 text-[#14f195]" />
              <EventsSingleLocation event={event} />
            </span>
          </div>
          <h2 className="mb-5 font-brand text-[36px] font-bold leading-[1.08] text-white md:text-[56px]">
            {event.title}
          </h2>
          <p className="mb-0 max-w-2xl text-base leading-[1.7] text-white/70 md:text-lg">
            {description}
          </p>
        </div>
        <Button
          to={eventUrl}
          arrow={true}
          newTab
          rel={
            !eventUrl.includes("solana.com")
              ? "noopener noreferrer nofollow"
              : "noopener noreferrer"
          }
          variant="secondary"
        >
          {t("events.detail.action")}
        </Button>
        <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <SocialShareButtons
            url={eventUrl}
            title={event.title}
            className="mt-0"
          />
          <Link
            to={eventUrl}
            target="_blank"
            rel={
              !eventUrl.includes("solana.com")
                ? "noopener noreferrer nofollow"
                : "noopener noreferrer"
            }
            className="inline-flex items-center gap-2 font-brand-mono text-xs uppercase text-[#80ecff] transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#80ecff]"
          >
            Open event
            <ArrowUpRight aria-hidden className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EventsDetailSection;
