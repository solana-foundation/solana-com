"use client";

import { useTemplateFilterState } from "../../lib/templates";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
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
        className="flex flex-col gap-2 border-b border-white/5 pb-4 last:border-b-0"
        key={filter.id}
      >
        <button
          onClick={() => toggleSection(filter.id)}
          className="flex items-center justify-between text-sm font-bold py-1.5 hover:text-purple-400 transition-colors"
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
                      className="flex items-center gap-2 cursor-pointer hover:text-purple-400 transition-colors text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleKeyword(keyword.id)}
                        className="w-3.5 h-3.5 rounded border-white/10 bg-zinc-800/50 checked:bg-purple-500 checked:border-purple-500 cursor-pointer"
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
