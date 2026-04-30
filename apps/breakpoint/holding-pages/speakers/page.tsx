import type { Metadata } from "next";
import ImageTreatment from "@/components/ImageTreatment";
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

function SpeakersHeroBackground() {
  return (
    <div className="absolute left-1/2 top-[-340px] flex h-[max(810px,56.25vw)] w-screen min-w-[1440px] -translate-x-1/2 items-center justify-center">
      <div className="flex-none -rotate-90">
        <ImageTreatment
          src="/img/subpage-heroes/speakers.png"
          alt=""
          aria-hidden="true"
          glitchPattern="p1"
          intensity={60}
          lighting="even"
          color="green"
          motion
          flicker
          mouseReactive
          mouseRadius={180}
          className="h-[max(1440px,100vw)] w-[max(810px,56.25vw)]"
        />
      </div>
    </div>
  );
}

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
        background={<SpeakersHeroBackground />}
        imageHeightClassName="h-[432px] md:h-[467px]"
        title="Speakers"
        tintClassName="bg-green"
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
