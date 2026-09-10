import PageShell from "@/components/PageShell";
import Marquee from "@/components/Marquee";
import Footer from "@/components/sections/Footer";
import SubpageHero from "@/components/SubpageHero";
import AwardsNominations from "./AwardsNominations";

const AWARDS_MARQUEE_HIGHLIGHTS = [
  "COMMUNITY",
  "CULTURE",
  "CREATORS",
  "BUILDERS",
  "BP26 AWARDS",
];

export default function AwardsPage() {
  return (
    <PageShell
      contentId="breakpoint-awards-content"
      navigation={{
        ctaAlwaysVisible: true,
        ctaHref: "/registration",
        ctaLabel: "Register",
        showMenuButton: true,
      }}
    >
      <SubpageHero
        eyebrow="Breakpoint 2026"
        heroImage="awards"
        title="Community Awards"
      >
        <p className="max-w-[620px] text-p-large text-white">
          Put the people, projects, and communities moving Solana forward in the
          spotlight.
        </p>
      </SubpageHero>
      <Marquee
        highlightClassName="text-purple"
        highlights={AWARDS_MARQUEE_HIGHLIGHTS}
      />
      <AwardsNominations />
      <Footer backgroundColor="purple" />
    </PageShell>
  );
}
