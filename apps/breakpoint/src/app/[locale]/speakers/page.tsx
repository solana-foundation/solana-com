import type { Metadata } from "next";
import ArrowUpRightIcon from "@/components/ArrowUpRightIcon";
import PageShell from "@/components/PageShell";
import SpeakersFooter from "@/components/pages/speakers/SpeakersFooter";
import SpeakersList from "@/components/pages/speakers/SpeakersList";
import { getAirtableSpeakers } from "@/content/speakers/airtable";
import { fallbackSpeakers } from "@/content/speakers/fallback-speakers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Speakers | Breakpoint 2026",
  description:
    "Meet the speakers joining Breakpoint 2026 in London for keynotes, firesides, debates, and product demos.",
};

const APPLY_TO_SPEAK_HREF =
  "mailto:breakpoint@solana.org?subject=Breakpoint%202026%20speaker%20application";

function SpeakersHero() {
  return (
    <section className="relative h-[428px] w-full overflow-hidden bg-black md:h-[467px]">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[360px] overflow-hidden"
      >
        <img
          src="/img/registration-hero-glitch.png"
          alt=""
          width={1200}
          height={800}
          className="absolute left-1/2 top-[-340px] h-[960px] w-[1440px] max-w-none -translate-x-1/2 object-cover"
        />
        <div className="absolute inset-0 bg-green mix-blend-multiply" />
      </div>

      <img
        src="/assets/pixel-edge.svg"
        alt=""
        aria-hidden="true"
        width={1440}
        height={146}
        className="pointer-events-none absolute left-1/2 top-[160px] h-[200px] w-[1078px] max-w-none -translate-x-1/2 md:left-0 md:w-full md:min-w-[840px] md:translate-x-0"
      />

      <div className="absolute left-xs right-xs top-[252px] flex flex-col items-start gap-[20px] pb-3 text-white md:left-8 md:right-auto md:w-[1026px]">
        <p className="font-mono text-[16px] font-normal uppercase leading-[1.3] tracking-[0.08em]">
          Breakpoint 2026
        </p>
        <h1 className="font-sans text-[60px] font-normal leading-[0.98] tracking-[-0.06em] md:text-[80px]">
          Speakers
        </h1>
        <a
          href={APPLY_TO_SPEAK_HREF}
          className="inline-flex h-10 w-full items-center justify-center gap-3 bg-white px-5 font-mono text-[14px] font-bold uppercase leading-[0.9] tracking-[0.08em] text-black transition-colors hover:bg-[#e7d2f9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:w-auto"
        >
          Apply to speak
          <span className="inline-flex size-3 items-center justify-center">
            <ArrowUpRightIcon />
          </span>
        </a>
      </div>
    </section>
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
      <SpeakersHero />
      <SpeakersList
        speakers={speakers}
        designPreview={isDesignPreview}
        initialOpenSlug={isDesignPreview ? speakers[0]?.slug : undefined}
        preserveOrder={isDesignPreview}
      />
      <SpeakersFooter />
    </PageShell>
  );
}
