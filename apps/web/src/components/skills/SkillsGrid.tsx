"use client";

import { useState, useMemo } from "react";
import { SkillCard, SkillItem } from "./SkillCard";
import {
  CATEGORY_MAP,
  DEFAULT_CATEGORY,
  CategoryTranslations,
} from "./skillCategories";
import { CommunitySkill } from "@/data/skills/communitySkills";

type SkillsGridProps = {
  endorsedSkills: SkillItem[];
  communitySkills: CommunitySkill[];
  translations: {
    filterAll: string;
    viewOnGitHub: string;
    viewSkill: string;
    endorsedTitle: string;
    endorsedDescription: string;
    communityTitle: string;
    communityDescription: string;
    categories: CategoryTranslations;
  };
};

export function SkillsGrid({
  endorsedSkills,
  communitySkills,
  translations,
}: SkillsGridProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const categoryKeys = useMemo(() => {
    const seen = new Set<string>();
    const endorsedKeys = endorsedSkills.map(
      (s) => (CATEGORY_MAP[s.slug] ?? DEFAULT_CATEGORY).labelKey,
    );
    const communityKeys = communitySkills.map((s) => s.category.labelKey);
    return [...endorsedKeys, ...communityKeys].filter((key) =>
      seen.has(key) ? false : seen.add(key),
    );
  }, [endorsedSkills, communitySkills]);

  const filteredEndorsed = selected
    ? endorsedSkills.filter(
        (s) => (CATEGORY_MAP[s.slug] ?? DEFAULT_CATEGORY).labelKey === selected,
      )
    : endorsedSkills;

  const filteredCommunity = selected
    ? communitySkills.filter((s) => s.category.labelKey === selected)
    : communitySkills;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-2 max-w-6xl mx-auto w-full">
        <button
          onClick={() => setSelected(null)}
          className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full border transition-colors cursor-pointer ${
            selected === null
              ? "border-white/40 bg-white/10 text-white"
              : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/60"
          }`}
        >
          {translations.filterAll}
        </button>
        {categoryKeys.map((key) => {
          const active = selected === key;
          const label = translations.categories[key] ?? key;
          return (
            <button
              key={key}
              onClick={() => setSelected(active ? null : key)}
              className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full border transition-colors cursor-pointer ${
                active
                  ? "border-white/40 bg-white/10 text-white"
                  : "border-white/15 text-white/40 hover:border-white/30 hover:text-white/60"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {filteredEndorsed.length > 0 && (
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white">
              {translations.endorsedTitle}
            </h2>
            <p className="text-white/50 text-sm">
              {translations.endorsedDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEndorsed.map((skill) => (
              <SkillCard
                key={skill.slug}
                skill={skill}
                linkLabel={translations.viewOnGitHub}
                categories={translations.categories}
              />
            ))}
          </div>
        </div>
      )}

      {filteredCommunity.length > 0 && (
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 mt-8">
          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-white">
              {translations.communityTitle}
            </h2>
            <p className="text-white/50 text-sm">
              {translations.communityDescription}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCommunity.map((skill) => (
              <SkillCard
                key={skill.slug}
                skill={{
                  slug: skill.slug,
                  title: skill.title,
                  description: skill.description,
                  githubUrl: skill.url,
                }}
                linkLabel={translations.viewSkill}
                categories={translations.categories}
                categoryOverride={skill.category}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
