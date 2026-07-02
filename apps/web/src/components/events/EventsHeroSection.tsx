"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import Link from "../../utils/Link";
import FormattedDate from "../shared/FormattedDate";
import type { CalendarEvent } from "@/lib/events/fetchCalendarEvents";

const EASE = [0.22, 1, 0.36, 1] as const;

const heroContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const heroItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

const EventsHeroSection = ({
  type = "hero",
  nextEvent,
}: {
  type?: string;
  nextEvent?: CalendarEvent | null;
}) => {
  const t = useTranslations();
  const isArchive = type === "archive";
  const reduce = useReducedMotion();

  const motionProps = reduce
    ? {}
    : {
        variants: heroContainer,
        initial: "hidden" as const,
        animate: "show" as const,
      };
  const itemProps = reduce ? {} : { variants: heroItem };

  return (
    <section className="relative border-b border-white/10 bg-black text-white">
      <motion.div
        className="container pb-16 pt-28 md:pb-24 md:pt-40"
        {...motionProps}
      >
        {isArchive && (
          <motion.div {...itemProps}>
            <Link
              to="/events"
              className="group mb-10 inline-flex items-center gap-2 font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/50 no-underline transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <ArrowLeft
                aria-hidden
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to events
            </Link>
          </motion.div>
        )}
        <motion.p
          className="mb-8 font-brand-mono text-[11px] uppercase tracking-[0.35em] text-white/40"
          {...itemProps}
        >
          {isArchive ? "Events — Archive" : "Solana — Events"}
        </motion.p>
        <motion.h1
          className="max-w-[15ch] font-brand text-5xl font-medium leading-[0.95] tracking-[-0.02em] text-white sm:text-7xl xl:text-[6.5rem]"
          {...itemProps}
        >
          {t(`events.${type}.title`)}
        </motion.h1>
        <motion.p
          className="mt-8 max-w-xl text-lg leading-relaxed text-white/55"
          {...itemProps}
        >
          {t(`events.${type}.subtitle`)}
        </motion.p>

        {!isArchive && (
          <motion.div
            className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-4"
            {...itemProps}
          >
            <HeroLink to="#upcoming">Upcoming</HeroLink>
            <HeroLink to="#community-events">Community</HeroLink>
            <HeroLink to="/events/archive">Past events</HeroLink>
          </motion.div>
        )}

        {!isArchive && nextEvent && (
          <motion.div {...itemProps}>
            <Link
              to={
                nextEvent.platform === "external"
                  ? nextEvent.key
                  : nextEvent.rsvp || nextEvent.lumaUrl || "#featured"
              }
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="group mt-16 flex flex-col gap-2 border-t border-white/10 pt-6 text-white no-underline sm:flex-row sm:items-baseline sm:justify-between"
            >
              <span className="font-brand-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
                Next
              </span>
              <span className="flex flex-1 flex-wrap items-baseline gap-x-4 gap-y-1 sm:justify-end">
                {nextEvent.schedule?.from && (
                  <span className="font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/50">
                    <FormattedDate
                      date={nextEvent.schedule.from}
                      format="MMM d"
                      timezone={nextEvent.schedule.timezone}
                    />
                  </span>
                )}
                <span className="font-brand text-lg font-medium text-white transition-opacity duration-200 group-hover:opacity-60">
                  {nextEvent.title}
                </span>
                <ArrowUpRight
                  aria-hidden
                  className="h-4 w-4 text-white/40 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

function HeroLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center font-brand-mono text-[11px] uppercase tracking-[0.25em] text-white/70 no-underline transition-colors duration-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
    >
      <span className="border-b border-white/25 pb-1 transition-colors duration-200 group-hover:border-white">
        {children}
      </span>
    </Link>
  );
}

export default EventsHeroSection;
