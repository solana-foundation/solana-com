import React from "react";
import { getTranslations } from "@workspace/i18n/server";
import EventsCarousel from "@/components/sections/EventsCarousel";
import {
  getHighlightedEvents,
  getPastHighlightedEvents,
} from "@/content/events/luma";

export default async function EventsSection({
  postConference = false,
}: { postConference?: boolean } = {}) {
  const t = await getTranslations("breakpoint");
  const events = await (postConference
    ? getPastHighlightedEvents()
    : getHighlightedEvents());

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="pt-20 md:pt-[120px]">
      <div className="container">
        {postConference && (
          <p className="type-paragraph mb-m text-text-secondary">
            {t("post.eventsBody")}
          </p>
        )}
        <EventsCarousel
          headline={t(
            postConference ? "post.eventsHeadline" : "events.headline",
          )}
          communityCta={t(
            postConference ? "post.eventsCta" : "events.communityCta",
          )}
          items={events}
        />
      </div>
    </section>
  );
}
