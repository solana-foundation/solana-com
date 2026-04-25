import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SubpageHero from "@/components/SubpageHero";
import AgendaList from "@/components/pages/agenda/AgendaList";
import Footer from "@/components/sections/Footer";
import { getAirtableAgenda } from "@/content/agenda/airtable";
import { fallbackAgenda } from "@/content/agenda/fallback-agenda";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agenda | Breakpoint 2026",
  description:
    "Explore the Breakpoint 2026 schedule across keynotes, firesides, debates, breaks, and community events.",
};

const COMMUNITY_EVENTS_HREF = "https://luma.com/bp26";

export default async function AgendaPage() {
  const agenda = (await getAirtableAgenda()) ?? fallbackAgenda;

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
        title="Schedule"
        tintClassName="bg-purple"
        cta={{
          href: COMMUNITY_EVENTS_HREF,
          label: "Explore community events",
          variant: "secondary",
        }}
      />
      <AgendaList items={agenda} />
      <Footer />
    </PageShell>
  );
}
