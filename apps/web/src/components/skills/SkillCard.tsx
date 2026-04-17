import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Category,
  CATEGORY_MAP,
  DEFAULT_CATEGORY,
  CategoryTranslations,
} from "./skillCategories";

export type SkillItem = {
  slug: string;
  title: string;
  description: string;
  githubUrl: string;
  sourceType?: "official" | "community";
  pinnedRef?: string;
};

type SkillCardProps = {
  skill: SkillItem;
  linkLabel: string;
  categories: CategoryTranslations;
  categoryOverride?: Category;
};

export function SkillCard({
  skill,
  linkLabel,
  categories,
  categoryOverride,
}: SkillCardProps) {
  const category =
    categoryOverride ?? CATEGORY_MAP[skill.slug] ?? DEFAULT_CATEGORY;
  const label = categories[category.labelKey] ?? category.labelKey;
  const isCommunity = skill.sourceType === "community";

  return (
    <Link
      href={skill.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col group cursor-pointer border-l-2 ${category.accent} hover:bg-white/5 transition-colors duration-200 p-[20px] md:p-[24px] h-full`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span
          className={`text-[11px] font-medium uppercase tracking-[0.05em] ${category.badge} px-2 py-0.5 rounded-full`}
        >
          {label}
        </span>
        {isCommunity && (
          <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-amber-200/70">
            Third-party
          </span>
        )}
        {skill.pinnedRef && (
          <span className="text-[10px] font-mono tracking-tight text-white/35">
            {skill.pinnedRef}
          </span>
        )}
      </div>
      <h3 className="font-medium text-base md:text-lg leading-snug tracking-[-0.18px] text-white mb-1.5">
        {skill.title}
      </h3>
      {skill.description && (
        <p className="text-[#ABABBA] text-sm leading-relaxed grow mb-0">
          {skill.description}
        </p>
      )}
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ABABBA] group-hover:text-white transition-colors w-fit mt-4">
        {linkLabel}
        <ChevronRight size={14} aria-hidden={true} />
      </span>
    </Link>
  );
}
