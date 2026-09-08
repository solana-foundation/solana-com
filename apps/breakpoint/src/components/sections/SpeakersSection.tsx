import { getTranslations } from "@workspace/i18n/server";
import SpeakersCarousel from "@/components/sections/SpeakersCarousel";
import { getAirtableSpeakers } from "@/content/speakers/airtable";
import { fallbackSpeakers } from "@/content/speakers/fallback-speakers";

const HOMEPAGE_SPEAKER_COUNT = 5;

export default async function SpeakersSection() {
  const [t, airtableSpeakers] = await Promise.all([
    getTranslations("breakpoint"),
    getAirtableSpeakers(),
  ]);
  const speakers = (
    airtableSpeakers ??
    (process.env.NODE_ENV === "production" ? [] : fallbackSpeakers)
  ).slice(0, HOMEPAGE_SPEAKER_COUNT);

  if (speakers.length === 0) return null;

  return (
    <section id="speakers" className="pt-20 md:pt-[120px]">
      <div className="container">
        <SpeakersCarousel
          ctaLabel={t("homeSpeakers.cta")}
          eyebrow={t("homeSpeakers.eyebrow")}
          headline={t("homeSpeakers.headline")}
          speakers={speakers}
        />
      </div>
    </section>
  );
}
