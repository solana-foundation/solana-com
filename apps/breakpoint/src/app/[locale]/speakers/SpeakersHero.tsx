import SubpageHero from "@/components/SubpageHero";

const APPLY_TO_SPEAK_HREF =
  "mailto:breakpoint@solana.org?subject=Breakpoint%202026%20speaker%20application";

export default function SpeakersHero() {
  return (
    <SubpageHero
      title="Speakers"
      tintClassName="bg-green"
      cta={{ href: APPLY_TO_SPEAK_HREF, label: "Apply to speak" }}
    />
  );
}
