import Link from "next/link";
import {
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
  viewOnGitHub: string;
  categories: CategoryTranslations;
};

export function SkillCard({ skill, viewOnGitHub, categories }: SkillCardProps) {
  const category = CATEGORY_MAP[skill.slug] ?? DEFAULT_CATEGORY;
  const label = categories[category.labelKey] ?? category.labelKey;

  return (
    <Link
      href={skill.githubUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col gap-3 group cursor-pointer border-t-2 ${category.accent} bg-white/[0.03] hover:bg-white/[0.07] transition-colors p-5 rounded-sm`}
    >
      <span
        className={`self-start text-xs font-medium uppercase tracking-wider px-2 py-0.5 rounded-full ${category.badge}`}
      >
        {label}
      </span>
      <h3 className="text-base font-semibold group-hover:underline text-white leading-snug">
        {skill.title}
      </h3>
      {skill.description && (
        <p className="text-white/50 text-sm grow leading-relaxed">
          {skill.description}
        </p>
      )}
      <span className="inline-flex items-center gap-1 text-xs font-medium text-white/30 group-hover:text-white/60 transition-colors w-fit mt-auto pt-1">
        {viewOnGitHub}
      </span>
    </Link>
  );
}
