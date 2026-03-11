"use client";

import { useState, useMemo } from "react";
import { SkillCard, SkillItem } from "./SkillCard";
import {
  CATEGORY_MAP,
  DEFAULT_CATEGORY,
  CategoryTranslations,
} from "./skillCategories";

type SkillsGridProps = {
  skills: SkillItem[];
  translations: {
    filterAll: string;
    viewOnGitHub: string;
    categories: CategoryTranslations;
  };
};

export function SkillsGrid({ skills, translations }: SkillsGridProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const categoryKeys = useMemo(() => {
    const seen = new Set<string>();
    return skills
      .map((s) => (CATEGORY_MAP[s.slug] ?? DEFAULT_CATEGORY).labelKey)
      .filter((key) => (seen.has(key) ? false : seen.add(key)));
  }, [skills]);

  const filtered = selected
    ? skills.filter(
        (s) => (CATEGORY_MAP[s.slug] ?? DEFAULT_CATEGORY).labelKey === selected,
      )
    : skills;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto w-full">
        {filtered.map((skill) => (
          <SkillCard
            key={skill.slug}
            skill={skill}
            viewOnGitHub={translations.viewOnGitHub}
            categories={translations.categories}
          />
        ))}
      </div>
    </div>
  );
}
