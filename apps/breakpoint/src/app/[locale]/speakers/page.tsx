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

function SpeakersHeroBackground() {
  return (
    <div className="absolute left-1/2 top-[-340px] flex h-[810px] w-[1440px] -translate-x-1/2 items-center justify-center">
      <div className="flex-none -rotate-90">
        <img
          src="/img/speakers-hero.png"
          alt=""
          aria-hidden="true"
          width={675}
          height={1200}
          className="block h-[1440px] w-[810px] max-w-none object-cover"
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
