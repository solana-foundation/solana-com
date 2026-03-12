"use client";

import AiHero from "@/components/ai/AiHero";
import AiWhySection from "@/components/ai/AiWhySection";
import AiCard from "@/components/ai/AiCard";
import AiBuild from "@/components/ai/AiBuild";

export function AiPageContent() {
  return (
    <div className="overflow-hidden pb-10 mb-n10">
      <AiHero />
      <AiWhySection />
      <AiCard />
      <AiBuild />
    </div>
  );
}
