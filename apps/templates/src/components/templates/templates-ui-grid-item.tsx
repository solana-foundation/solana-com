"use client";

import { Template, TemplatesUiImage } from "../../lib/templates";
import { useTemplatesTranslations } from "../../lib/use-translations";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import { motion } from "framer-motion";

const MotionLink = motion(Link);

export function TemplatesUiGridItem({ template }: { template: Template }) {
  const t = useTemplatesTranslations();

  return (
    <MotionLink
      href={`/developers/templates/${template.name}`}
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950 p-6 block h-full flex flex-col"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ willChange: "transform" }}
    >
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950" />

      <div className="relative flex flex-col h-full">
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-semibold text-base text-white line-clamp-1">
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
              className="text-xs flex items-center gap-1 hover:text-purple-400 transition-colors text-zinc-400 flex-shrink-0"
            >
              <ExternalLinkIcon className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-400 line-clamp-2">
            {template.description}
          </p>
        </div>

        <div
          className="relative w-full overflow-hidden rounded-lg bg-white/5 backdrop-blur-sm mt-auto"
          style={{ aspectRatio: "1200/630" }}
        >
          <TemplatesUiImage template={template} />
        </div>
      </div>
    </MotionLink>
  );
}
