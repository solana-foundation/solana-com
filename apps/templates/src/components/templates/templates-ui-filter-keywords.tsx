"use client";

import { useTemplateFilterState } from "../../lib/templates";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "@boxicons/react/ChevronDown";
import { useState } from "react";

export function TemplatesUiFilterKeywords() {
  const { filters, selectedKeywords, toggleKeyword } = useTemplateFilterState();
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "usecases",
  ]);

  const toggleSection = (filterId: string) => {
    setExpandedSections((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId],
    );
  };

  return filters.map((filter) => {
    const isExpanded = expandedSections.includes(filter.id);
    return (
      <div
        className="flex flex-col gap-2 border-b border-white/[0.08] pb-4 last:border-b-0 last:pb-0"
        key={filter.id}
      >
        <button
          type="button"
          onClick={() => toggleSection(filter.id)}
          className="flex items-center justify-between py-1.5 font-brand-mono text-[11px] font-medium uppercase tracking-[0.08em] text-nd-high-em-text transition-colors hover:text-nd-mid-em-text"
        >
          <span>{filter.name}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 pt-1">
                {filter.keywords.map((keyword) => {
                  const isSelected = selectedKeywords.includes(keyword.id);
                  return (
                    <label
                      key={keyword.id}
                      className="group flex cursor-pointer items-center gap-2.5 text-sm text-nd-mid-em-text transition-colors hover:text-nd-high-em-text"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleKeyword(keyword.id)}
                        className="size-3.5 cursor-pointer rounded-sm border-white/25 bg-white/[0.04] accent-white"
                      />
                      <span>{keyword.name}</span>
                    </label>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  });
}
