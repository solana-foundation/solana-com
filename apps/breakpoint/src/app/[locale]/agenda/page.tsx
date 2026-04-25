import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/sections/Footer";
import AgendaHero from "./AgendaHero";
import AgendaList from "./AgendaList";
import { getAirtableAgenda } from "./airtable";
import { fallbackAgenda } from "./fallback-agenda";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Agenda | Breakpoint 2026",
  description:
    "Explore the Breakpoint 2026 schedule across keynotes, firesides, debates, breaks, and community events.",
};

export default async function AgendaPage() {
  const agenda = (await getAirtableAgenda()) ?? fallbackAgenda;

  return (
    <main className="relative min-h-screen bg-black text-white">
      <a
        href="#breakpoint-agenda-content"
        className="sr-only absolute left-5 top-5 z-50 focus:not-sr-only focus:bg-white focus:px-4 focus:py-2 focus:font-mono focus:text-[14px] focus:font-bold focus:uppercase focus:tracking-[0.08em] focus:text-black"
      >
        Skip to content
      </a>

      <Navigation
        ctaAlwaysVisible
        ctaHref="/registration"
        ctaLabel="Register"
        showMenuButton
      />

      <div id="breakpoint-agenda-content">
        <AgendaHero />
        <AgendaList items={agenda} />
        <Footer />
      </div>
    </main>
  );
}
