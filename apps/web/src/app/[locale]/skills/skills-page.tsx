"use client";

import SkillsHero from "@/components/skills/SkillsHero";
import SkillsGrid from "@/components/skills/SkillsGrid";
import SkillsInstall from "@/components/skills/SkillsInstall";

export function SkillsPageContent() {
  return (
    <div className="overflow-hidden pb-10 mb-n10">
      <SkillsHero />
      <SkillsGrid />
      <SkillsInstall />
    </div>
  );
}
