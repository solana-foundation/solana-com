"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { EventCard } from "./EventCard";
import { CarouselArrow } from "./CarouselArrow";
import { useHorizontalCarousel } from "./useHorizontalCarousel";
import { getImagePath } from "@/config";
import { chinaStops } from "@/data/china-stops";
import { useTranslations } from "@workspace/i18n/client";

interface EventLineupProps {
  futureOnly?: boolean;
}

export function EventLineup({ futureOnly = false }: EventLineupProps) {
  const t = useTranslations("accelerate.homepage");
  const chinaEvents = chinaStops.map((stop) => {
    const eventCopy = t.raw(
      `eventLineup.events.${stop.city.toLowerCase()}`,
    ) as { subtitle: string; dateLocation: string };

    return {
      image: getImagePath(stop.image),
      city: stop.city,
      subtitle: eventCopy.subtitle,
      dateLocation: eventCopy.dateLocation,
      href:
        stop.city === "Shanghai" ? "/accelerate/china" : stop.registrationUrl,
      external: stop.city !== "Shanghai",
      active: true,
    };
  });
  const events = [
    ...chinaEvents,
    {
      image: getImagePath("/images/homepage/miami-card-photo.jpg"),
      city: t("eventLineup.events.miami.city"),
      subtitle: t("eventLineup.events.miami.subtitle"),
      dateLocation: t("eventLineup.events.miami.dateLocation"),
      href: "/accelerate/miami",
      external: false,
      active: false,
    },
    {
      image: getImagePath("/images/homepage/ai-miami-card-photo.webp"),
      city: t("eventLineup.events.aiMiami.city"),
      subtitle: t("eventLineup.events.aiMiami.subtitle"),
      dateLocation: t("eventLineup.events.aiMiami.dateLocation"),
      href: "https://www.youtube.com/watch?v=OycUj-Z32dM",
      external: true,
      active: false,
    },
    {
      image: getImagePath("/images/homepage/hk-card-photo.jpg"),
      city: t("eventLineup.events.hongKong.city"),
      subtitle: t("eventLineup.events.hongKong.subtitle"),
      dateLocation: t("eventLineup.events.hongKong.dateLocation"),
      href: "/accelerate/hong-kong",
      external: false,
      active: false,
    },
  ];
  const displayEvents = futureOnly ? events.filter((e) => e.active) : events;
  const { scrollRef, canScrollLeft, canScrollRight, scroll } =
    useHorizontalCarousel();

  return (
    <section className="relative bg-black py-16 lg:py-24">
      {/* Pattern background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <Image
          src={getImagePath("/images/homepage/pattern-bgr.svg")}
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-6">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center text-[40px] font-light uppercase leading-[1.2] tracking-[4px] text-accelerate-gray-100 md:text-[60px] lg:mb-16 lg:text-[80px]"
        >
          {t("eventLineup.heading")}
        </motion.h2>

        {/* Cards with scroll arrows */}
        <div className="relative">
          {/* Shared carousel controls */}
          <div className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 md:block lg:-left-4">
            <CarouselArrow
              direction="left"
              disabled={!canScrollLeft}
              onClick={() => scroll("left")}
              ariaControls="accelerate-lineup-carousel"
            />
          </div>
          <div className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 md:block lg:-right-4">
            <CarouselArrow
              direction="right"
              disabled={!canScrollRight}
              onClick={() => scroll("right")}
              ariaControls="accelerate-lineup-carousel"
            />
          </div>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            id="accelerate-lineup-carousel"
            className="scrollbar-hide flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
          >
            {displayEvents.map((event) => (
              <motion.div
                key={event.city}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="w-[242px] max-w-[529px] flex-shrink-0 snap-center md:w-[calc(100vw-48px)]"
              >
                <EventCard {...event} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
