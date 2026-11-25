import PageShell from "@/components/PageShell";
import SubpageHero from "@/components/SubpageHero";
import AgendaList from "@/components/pages/agenda/AgendaList";
import Footer from "@/components/sections/Footer";
import { getAirtableAgenda } from "@/content/agenda/airtable";
import { fallbackAgenda } from "@/content/agenda/fallback-agenda";
import { attachSpeakerProfiles } from "@/content/agenda/speaker-links";
import type { AgendaItem } from "@/content/agenda/types";
import { SIDE_EVENTS_HREF } from "@/content/links";
import { getAirtableSpeakers } from "@/content/speakers/airtable";

type AgendaPageProps = {
  communityEventsLabel: string;
  title: string;
};

/**
 * Airtable is the only source of published sessions. The placeholder agenda
 * exists so the layout can be worked on without credentials, and never ships.
 */
function resolveAgenda(agenda: AgendaItem[] | null): AgendaItem[] {
  if (agenda) return agenda;
  return process.env.NODE_ENV === "production" ? [] : fallbackAgenda;
}

export default async function AgendaPage({
  communityEventsLabel,
  title,
}: AgendaPageProps) {
  const [agenda, speakers] = await Promise.all([
    getAirtableAgenda(),
    getAirtableSpeakers(),
  ]);
  const items = attachSpeakerProfiles(resolveAgenda(agenda), speakers ?? []);

  return (
    <PageShell
      contentId="breakpoint-agenda-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: "/registration",
        ctaLabel: "Register",
        showMenuButton: true,
      }}
    >
      <SubpageHero
        heroImage="schedule"
        title={title}
        cta={{
          href: SIDE_EVENTS_HREF,
          label: communityEventsLabel,
          target: "_blank",
          variant: "secondary",
        }}
      />
      <AgendaList items={items} />
      <Footer />
    </PageShell>
  );
}
