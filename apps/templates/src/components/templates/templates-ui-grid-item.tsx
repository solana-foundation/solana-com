"use client";

import type { Template } from "../../lib/types/templates";
import { TemplatesUiImage } from "../../lib/templates/templates-ui-image";
import { useTemplatesTranslations } from "../../lib/use-translations";
import Link from "next/link";
import { ArrowOutUpRightSquare as ExternalLinkIcon } from "@boxicons/react/ArrowOutUpRightSquare";
import { ArrowRight } from "@boxicons/react/ArrowRight";
import { useTemplateFilters } from "../../lib/templates/use-template-filters";

export function TemplatesUiGridItem({ template }: { template: Template }) {
  const t = useTemplatesTranslations();
  const filters = useTemplateFilters({ template });
  const keywords = filters.flatMap((filter) => filter.keywords).slice(0, 3);
  const displayName = template.displayName || template.name;

  return (
    <article className="group relative min-w-0 bg-[#0C0C0E] transition-colors hover:bg-[#151518]">
      <Link
        href={`/developers/templates/${template.name}`}
        className="flex h-full flex-col outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/70"
      >
        <div className="relative aspect-[16/10] overflow-hidden border-b border-white/[0.08] bg-white/[0.03]">
          <TemplatesUiImage
            template={template}
            className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.025]"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 360px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-60" />
        </div>

        <div className="flex flex-1 flex-col p-5 xl:p-6">
          {keywords.length ? (
            <div className="mb-5 flex flex-wrap gap-1.5">
              {keywords.map((keyword) => (
                <span
                  key={keyword.id}
                  className="border border-white/[0.12] bg-white/[0.03] px-2 py-1 font-brand-mono text-[10px] font-medium uppercase tracking-[0.06em] text-nd-mid-em-text"
                >
                  {keyword.name}
                </span>
              ))}
            </div>
          ) : null}

          <div className="flex items-start justify-between gap-4">
            <h3 className="nd-heading-xs line-clamp-2 text-nd-high-em-text">
              {displayName}
            </h3>
            <ArrowRight className="mt-1 size-4 shrink-0 text-nd-mid-em-text transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" />
          </div>
          <p className="mt-2 line-clamp-3 text-sm leading-5 text-nd-mid-em-text">
            {template.description}
          </p>
        </div>
      </Link>

      <a
        href={template.repoUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={t("actions.view_repo")}
        aria-label={`${t("actions.view_repo")}: ${displayName}`}
        className="absolute right-3 top-3 z-10 flex size-9 items-center justify-center rounded-full border border-white/[0.16] bg-black/70 text-nd-mid-em-text backdrop-blur-md transition-colors hover:border-white/30 hover:bg-black hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        <ExternalLinkIcon className="size-4" />
      </a>
    </article>
  );
}
