import type { Metadata } from "next";
import PageShell from "@/components/PageShell";
import SpeakersList from "@/components/pages/speakers/SpeakersList";
import SubpageHero from "@/components/SubpageHero";
import { getAirtableSpeakers } from "@/content/speakers/airtable";
import { fallbackSpeakers } from "@/content/speakers/fallback-speakers";
import Footer from "@/components/sections/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Speakers | Breakpoint 2026",
  description:
    "Meet the speakers joining Breakpoint 2026 in London for keynotes, firesides, debates, and product demos.",
};

const APPLY_TO_SPEAK_HREF =
  "mailto:breakpoint@solana.org?subject=Breakpoint%202026%20speaker%20application";

export default async function SpeakersPage() {
  const isDesignPreview = process.env.NODE_ENV !== "production";
  const speakers = isDesignPreview
    ? fallbackSpeakers
    : ((await getAirtableSpeakers()) ?? fallbackSpeakers);

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
        title="Speakers"
        tintClassName="bg-green"
        imageTreatment={{
          flicker: true,
          intensity: 40,
          lighting: "contrast",
          motion: true,
        }}
        cta={{
          href: APPLY_TO_SPEAK_HREF,
          label: "Apply to speak",
        }}
      />
      <SpeakersList
        speakers={speakers}
        designPreview={isDesignPreview}
        initialOpenSlug={isDesignPreview ? speakers[0]?.slug : undefined}
        preserveOrder={isDesignPreview}
      />
      <Footer backgroundColor="green" />
    </PageShell>
  );
}
