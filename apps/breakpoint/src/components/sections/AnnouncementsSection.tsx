import React from "react";
import { getTranslations } from "@workspace/i18n/server";
import AnnouncementsCarousel from "@/components/sections/AnnouncementsCarousel";
import { fetchBreakpointAnnouncementLinks } from "@/lib/media-links";

export default async function AnnouncementsSection() {
  const t = await getTranslations("breakpoint");
  const items = await fetchBreakpointAnnouncementLinks();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="pt-20 md:pt-[120px]">
      <div className="container">
        <AnnouncementsCarousel
          headline={t("announcements.headline")}
          items={items}
        />
      </div>
    </section>
  );
}
