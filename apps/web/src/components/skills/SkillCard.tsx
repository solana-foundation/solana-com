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

  return (
    <Link
      href={skill.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col gap-3 group cursor-pointer border-l-2 ${category.accent} bg-white/5 hover:bg-white/[0.08] backdrop-blur-sm transition-all duration-200 p-[20px] md:p-[24px] h-full`}
    >
      <span
        className={`self-start text-[11px] font-medium uppercase tracking-[0.05em] px-2 py-0.5 rounded-full ${category.badge}`}
      >
        {label}
      </span>
      <h3 className="font-medium text-base md:text-lg leading-snug tracking-[-0.18px] text-white">
        {skill.title}
      </h3>
      {skill.description && (
        <p className="text-[#ABABBA] text-sm grow leading-relaxed">
          {skill.description}
        </p>
      )}
      <span className="inline-flex items-center gap-1 text-xs font-medium text-[#ABABBA] group-hover:text-white transition-colors w-fit mt-auto pt-1">
        {linkLabel}
        <ChevronRight size={14} aria-hidden={true} />
      </span>
    </Link>
  );
}
