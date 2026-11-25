import { getAirtableAgenda } from "@/content/agenda/airtable";
import { attachSpeakerSessions } from "@/content/speakers/sessions";
import PageShell from "@/components/PageShell";
import SpeakersList from "@/components/pages/speakers/SpeakersList";
import SubpageHero from "@/components/SubpageHero";
import { getAirtableSpeakers } from "@/content/speakers/airtable";
import Footer from "@/components/sections/Footer";

type SpeakersPageProps = {
  title?: string;
};

export default async function SpeakersPage({
  title = "Speakers",
}: SpeakersPageProps = {}) {
  const [airtableSpeakers, agenda] = await Promise.all([
    getAirtableSpeakers(),
    getAirtableAgenda(),
  ]);
  const speakers = attachSpeakerSessions(airtableSpeakers ?? [], agenda ?? []);

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
      <SubpageHero heroImage="speakers" title={title} />
      <SpeakersList speakers={speakers} />
      <Footer backgroundColor="green" />
    </PageShell>
  );
}
