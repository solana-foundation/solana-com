import type { Metadata } from "next";
import Navigation from "@/components/Navigation";
import { getAirtableSpeakers } from "./airtable";
import { fallbackSpeakers } from "./fallback-speakers";
import SpeakersFooter from "./SpeakersFooter";
import SpeakersHero from "./SpeakersHero";
import SpeakersList from "./SpeakersList";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Speakers | Breakpoint 2026",
  description:
    "Meet the speakers joining Breakpoint 2026 in London for keynotes, firesides, debates, and product demos.",
};

export default async function SpeakersPage() {
  const speakers = (await getAirtableSpeakers()) ?? fallbackSpeakers;

  return (
    <main className="relative min-h-screen bg-black text-white">
      <a
        href="#breakpoint-speakers-content"
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

      <div id="breakpoint-speakers-content">
        <SpeakersHero />
        <SpeakersList speakers={speakers} />
        <SpeakersFooter />
      </div>
    </main>
  );
}
