import React from "react";
import { getTranslations } from "next-intl/server";
import AnnouncementsCarousel from "@/components/sections/AnnouncementsCarousel";
import WordReveal from "@/components/WordReveal";
import { fetchBreakpointAnnouncementLinks } from "@/lib/media-links";

export default async function AnnouncementsSection() {
  const t = await getTranslations("breakpoint");
  const items = await fetchBreakpointAnnouncementLinks();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-neutral-700 py-3xl">
      <div className="container">
        <WordReveal
          as="h2"
          text={t("announcements.headline")}
          stepMs={85}
          className="mb-xl font-sans text-[32px] leading-[1.15] tracking-[-0.96px] text-white md:text-[48px]"
        />
        <AnnouncementsCarousel items={items} />
      </div>
    </section>
  );
}
