"use client";

import { useState, useMemo } from "react";
import { SkillCard, SkillItem } from "./SkillCard";
import {
  CATEGORY_MAP,
  DEFAULT_CATEGORY,
  CategoryTranslations,
} from "./skillCategories";
import { CommunitySkill } from "@/data/skills/communitySkills";
import { Divider } from "@/components/solutions/divider.v2";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { cn } from "@/app/components/utils";

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

  const { ref: endorsedRef, isIntersecting: endorsedVisible } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true,
    });

  const { ref: communityRef, isIntersecting: communityVisible } =
    useIntersectionObserver<HTMLDivElement>({
      threshold: 0.1,
      triggerOnce: true,
    });

  return (
    <div className="flex flex-col">
      <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] w-full py-[32px] md:py-[48px]">
        <div className="flex flex-wrap items-center gap-2">
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
      </div>

      <Divider />

      {filteredEndorsed.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] w-full py-[64px] md:py-[112px] xl:py-[160px]">
          <div className="mb-[32px] xl:mb-[48px]">
            <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
              {translations.endorsedTitle}
            </h2>
            <p className="text-[#ABABBA] text-lg md:text-2xl mt-2 xl:mt-5 mb-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
              {translations.endorsedDescription}
            </p>
          </div>
          <div
            ref={endorsedRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6"
          >
            {filteredEndorsed.map((skill, index) => (
              <div
                key={skill.slug}
                className={cn(endorsedVisible && "animate-fade-in-up")}
                style={
                  endorsedVisible
                    ? { animationDelay: `${0.1 + index * 0.05}s` }
                    : { opacity: 0 }
                }
              >
                <SkillCard
                  skill={skill}
                  linkLabel={translations.viewOnGitHub}
                  categories={translations.categories}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredEndorsed.length > 0 && filteredCommunity.length > 0 && (
        <Divider />
      )}

      {filteredCommunity.length > 0 && (
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[32px] xl:px-[40px] w-full py-[64px] md:py-[112px] xl:py-[160px]">
          <div className="mb-[32px] xl:mb-[48px]">
            <h2 className="font-brand font-medium leading-[1.25] md:leading-[1.1] xl:leading-[1.125] text-[32px] md:text-[40px] xl:text-[64px] mb-0 tracking-[-1.28px] md:tracking-[-1.6px] xl:tracking-[-2.56px]">
              {translations.communityTitle}
            </h2>
            <p className="text-[#ABABBA] text-lg md:text-2xl mt-2 xl:mt-5 mb-0 tracking-[-0.36px] md:tracking-[-0.48px] leading-[1.33]">
              {translations.communityDescription}
            </p>
          </div>
          <div
            ref={communityRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 xl:gap-6"
          >
            {filteredCommunity.map((skill, index) => (
              <div
                key={skill.slug}
                className={cn(communityVisible && "animate-fade-in-up")}
                style={
                  communityVisible
                    ? { animationDelay: `${0.1 + index * 0.05}s` }
                    : { opacity: 0 }
                }
              >
                <SkillCard
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
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
