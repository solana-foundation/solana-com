import SubpageHero from "@/components/SubpageHero";

const COMMUNITY_EVENTS_HREF = "https://luma.com/bp26";

export default function AgendaHero() {
  return (
    <SubpageHero
      title="Schedule"
      tintClassName="bg-purple"
      cta={{
        href: COMMUNITY_EVENTS_HREF,
        label: "Explore community events",
        variant: "secondary",
      }}
    />
  );
}
