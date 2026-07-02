"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, CalendarPlus } from "lucide-react";
import EventsHeroSection from "@/components/events/EventsHeroSection";
import EventsDetailSection from "@/components/events/EventsDetailSection";
import EventsList from "@/components/events/EventsList";
import Button from "@/components/shared/Button";
import Divider from "@/components/shared/Divider";
import Link, { InlineLink } from "@/utils/Link";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

interface EventsLandingPageProps {
  events: CalendarEvent[];
  communityEvents: CalendarEvent[];
  featuredEvent: CalendarEvent | null;
  usEvents: CalendarEvent[];
  translations: {
    usHeading: string;
    usDescription: string;
    communityHeading: string;
    communityDescription: string;
    submitEvent: string;
    archive: string;
  };
}

export function EventsLandingPage({
  events,
  communityEvents,
  featuredEvent,
  usEvents,
  translations,
}: EventsLandingPageProps) {
  const t = useTranslations();
  const visibleFeaturedEvent = featuredEvent || events[0] || null;

  const stats = useMemo(
    () => ({
      totalEvents: events.length + usEvents.length,
      communityEvents: communityEvents.length,
      virtualAndIrl: "IRL + online",
    }),
    [communityEvents.length, events.length, usEvents.length],
  );

  const communityCountries = useMemo(() => {
    const countries = new Set(
      communityEvents.map((event) => event.venue.country).filter(Boolean),
    );

    return countries.size;
  }, [communityEvents]);

  return (
    <div className="overflow-hidden bg-black text-white">
      <EventsHeroSection stats={stats} nextEvent={visibleFeaturedEvent} />

      <main>
        <section
          className="container relative -mt-10 pb-12 md:-mt-14"
          aria-label="Solana event overview"
        >
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <OverviewMetric
              label="Upcoming official events"
              value={events.length}
              detail="Conferences, launch weeks, hacker houses, and livestreams."
            />
            <OverviewMetric
              label="Regional gatherings"
              value={usEvents.length}
              detail="Local meetups and curated builder sessions."
            />
            <OverviewMetric
              label="Community cities"
              value={communityCountries || communityEvents.length}
              detail="A network of independent hosts and Solana communities."
            />
          </div>
        </section>

        <section
          id="featured-events"
          className="border-y border-white/10 bg-[#05070d] py-14 md:py-20"
        >
          <div className="container">
            <SectionHeader
              eyebrow="Featured"
              title="Start with the next marquee moment"
              description="A focused pick from the Solana calendar, followed by the full list of upcoming ecosystem events."
            />
            <EventsDetailSection event={visibleFeaturedEvent} />
          </div>
        </section>

        <section className="container py-14 md:py-20" id="official-events">
          <SectionHeader
            eyebrow="Official calendar"
            title="Upcoming Solana events"
            description="Find flagship gatherings, ecosystem programming, and builder-focused sessions from the Solana event calendar."
            action={
              <Button
                to="https://lu.ma/solana"
                newTab
                rel="noopener noreferrer nofollow"
                variant="outline"
              >
                Follow on Luma
              </Button>
            }
          />
          <EventsList list={events} emptyLabel="No upcoming official events." />

          {usEvents.length > 0 && (
            <div className="mt-20 rounded-lg border border-white/10 bg-white/[0.035] p-5 md:p-8">
              <SectionHeader
                eyebrow="Regional"
                title={translations.usHeading}
                description={translations.usDescription}
                compact
              />
              <EventsList list={usEvents} isCompact />
            </div>
          )}
        </section>

        <section
          id="community-events"
          className="relative border-y border-white/10 bg-[#07100d] py-14 md:py-20"
        >
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(120deg,rgba(20,241,149,0.18),transparent_35%),linear-gradient(300deg,rgba(128,236,255,0.14),transparent_40%)]" />
          <div className="container relative">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-12">
              <div>
                <SectionHeader
                  eyebrow="Community calendar"
                  title={translations.communityHeading}
                  description={translations.communityDescription}
                  compact
                />
                <div className="mt-6 space-y-4 text-white/70">
                  <p className="m-0">
                    {t.rich("events.community.help", {
                      meetupLink: (chunks) => (
                        <InlineLink to="https://community-meetups-playbook.super.site/">
                          {chunks}
                        </InlineLink>
                      ),
                    })}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <CommunityAction
                      href="https://lu.ma/solanafoundation-community"
                      label={translations.submitEvent}
                      description="Add an event for calendar review."
                      icon={CalendarPlus}
                    />
                  </div>
                </div>
              </div>
              <EventsList list={communityEvents} isCompact />
            </div>
          </div>
        </section>

        <section className="container py-12">
          <Divider className="mb-8" />
          <Button to="/events/archive" variant="outline">
            {translations.archive}
          </Button>
        </section>
      </main>
    </div>
  );
}

function OverviewMetric({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.055] p-5 shadow-[0_16px_60px_rgba(0,0,0,0.25)] backdrop-blur">
      <div className="font-brand text-4xl font-bold leading-none text-white">
        {value}
      </div>
      <div className="mt-4 font-brand-mono text-xs uppercase text-[#80ecff]">
        {label}
      </div>
      <p className="mb-0 mt-3 text-sm leading-[1.55] text-white/60">{detail}</p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  compact?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className={compact ? "max-w-2xl" : "max-w-3xl"}>
        <p className="mb-3 font-brand-mono text-xs uppercase text-[#14f195]">
          {eyebrow}
        </p>
        <h2 className="mb-4 font-brand text-[34px] font-bold leading-[1.1] text-white md:text-[48px]">
          {title}
        </h2>
        <p className="mb-0 text-base leading-[1.65] text-white/70 md:text-lg">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

function CommunityAction({
  href,
  label,
  description,
  icon: Icon,
}: {
  href: string;
  label: string;
  description: string;
  icon: typeof CalendarPlus;
}) {
  return (
    <Link
      to={href}
      className="group block rounded-lg border border-white/10 bg-black/25 p-4 text-white no-underline transition-colors duration-200 hover:border-[#14f195]/60 hover:bg-black/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#80ecff]"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      <span className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-[6px] bg-[#14f195] text-black">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <span className="flex-1">
          <span className="block font-brand text-lg font-semibold leading-[1.2] text-white">
            {label}
          </span>
          <span className="mt-1 block text-sm leading-[1.45] text-white/60">
            {description}
          </span>
        </span>
        <ArrowUpRight
          aria-hidden
          className="h-5 w-5 text-white/50 transition-colors duration-200 group-hover:text-[#14f195]"
        />
      </span>
    </Link>
  );
}
