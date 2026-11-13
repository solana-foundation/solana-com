import { getTranslations } from "@workspace/i18n/server";
import SectionHeadline from "@/components/SectionHeadline";
import InteractiveMap from "@/components/venue/InteractiveMap";

export default async function VenueMapSection() {
  const t = await getTranslations("breakpoint.venue");

  return (
    <section id="venue-map" className="pt-20 md:pt-[120px]">
      <div className="container flex flex-col gap-m md:gap-l">
        <div className="flex flex-col gap-s md:flex-row md:items-end md:justify-between">
          <SectionHeadline eyebrow={t("eyebrow")} headline={t("headline")} />
          <p className="type-paragraph max-w-[420px] text-text-secondary">
            {t("intro")}
          </p>
        </div>
        <InteractiveMap />
      </div>
    </section>
  );
}
