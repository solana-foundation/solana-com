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
        className="flex flex-col gap-2 border-b border-nd-border-light pb-4 last:border-b-0"
        key={filter.id}
      >
        <button
          onClick={() => toggleSection(filter.id)}
          className="flex items-center justify-between font-brand-mono text-[11px] leading-[1.42] font-bold uppercase tracking-wide py-1.5 text-nd-high-em-text hover:text-nd-cta transition-colors"
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
              <div className="flex flex-col gap-1.5 pt-1">
                {filter.keywords.map((keyword) => {
                  const isSelected = selectedKeywords.includes(keyword.id);
                  return (
                    <label
                      key={keyword.id}
                      className="flex items-center gap-2 cursor-pointer text-nd-mid-em-text hover:text-nd-high-em-text transition-colors text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleKeyword(keyword.id)}
                        className="w-3.5 h-3.5 rounded border-nd-border-prominent bg-white/5 checked:bg-nd-primary checked:border-nd-primary cursor-pointer"
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
