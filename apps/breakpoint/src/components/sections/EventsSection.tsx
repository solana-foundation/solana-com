import React from "react";
import { getTranslations } from "@workspace/i18n/server";
import EventsCarousel from "@/components/sections/EventsCarousel";
import { getHighlightedEvents } from "@/content/events/luma";

export default async function EventsSection() {
  const t = await getTranslations("breakpoint");
  const events = await getHighlightedEvents();

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="pt-20 md:pt-[120px]">
      <div className="container">
        <EventsCarousel
          headline={t("events.headline")}
          communityCta={t("events.communityCta")}
          items={events}
        />
      </div>
    </section>
  );
}
