"use client";

import { Template, TemplatesUiImage } from "../../lib/templates";
import { useTemplatesTranslations } from "../../lib/use-translations";
import Link from "next/link";
import { ArrowOutUpRightSquare as ExternalLinkIcon } from "@boxicons/react/ArrowOutUpRightSquare";
import { motion } from "motion/react";

const MotionLink = motion(Link);

export function TemplatesUiGridItem({ template }: { template: Template }) {
  const t = useTemplatesTranslations();

  return (
    <MotionLink
      href={`/developers/templates/${template.name}`}
      className="group relative overflow-hidden rounded-2xl border border-nd-border-light bg-[#0D0C11] p-6 block h-full flex flex-col transition-colors hover:border-nd-border-hovered hover:bg-[#121016]"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
    >
      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_right,rgba(202,159,245,0.08),transparent_60%)] opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />
      {/* Subtle top highlight */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

      <div className="relative flex flex-col h-full">
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-medium text-[17px] leading-[1.25] tracking-normal text-nd-high-em-text line-clamp-1">
              {template.displayName || template.name}
            </h3>
            <button
              onClick={(e) => {
                e.preventDefault();
                return window.open(
                  template.repoUrl,
                  "_blank",
                  "noopener,noreferrer",
                );
              }}
              title={t("actions.view_repo")}
              role="link"
              aria-label={t("actions.view_repo")}
              type="button"
              className="text-xs flex items-center gap-1 text-nd-mid-em-text hover:text-nd-high-em-text transition-colors flex-shrink-0"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs leading-relaxed text-nd-mid-em-text line-clamp-2">
            {template.description}
          </p>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-lg bg-white/[0.03] border border-nd-border-light mt-auto"
          style={{ aspectRatio: "1200/630" }}
        >
          <TemplatesUiImage template={template} />
        </div>
      </div>
    </MotionLink>
  );
}
