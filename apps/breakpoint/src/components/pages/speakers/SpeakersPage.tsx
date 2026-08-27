import PageShell from "@/components/PageShell";
import SpeakersList from "@/components/pages/speakers/SpeakersList";
import SubpageHero from "@/components/SubpageHero";
import { getAirtableSpeakers } from "@/content/speakers/airtable";
import { fallbackSpeakers } from "@/content/speakers/fallback-speakers";
import Footer from "@/components/sections/Footer";
import { APPLY_TO_SPEAK_HREF } from "@/content/links";

type SpeakersPageProps = {
  applyToSpeakLabel?: string;
  title?: string;
};

export default async function SpeakersPage({
  applyToSpeakLabel = "Apply to speak",
  title = "Speakers",
}: SpeakersPageProps = {}) {
  const airtableSpeakers = await getAirtableSpeakers();
  const speakers =
    airtableSpeakers ??
    (process.env.NODE_ENV === "production" ? [] : fallbackSpeakers);

  return (
    <PageShell
      contentId="breakpoint-speakers-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: "/registration",
        ctaLabel: "Register",
        showMenuButton: true,
      }}
    >
      <SubpageHero
        heroImage="speakers"
        title={title}
        cta={{
          href: APPLY_TO_SPEAK_HREF,
          label: applyToSpeakLabel,
        }}
      />
      <SpeakersList speakers={speakers} />
      <Footer backgroundColor="green" />
    </PageShell>
  );
}
