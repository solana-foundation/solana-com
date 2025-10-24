"use client";

import { Template } from "../../lib/templates";
import { TemplatesUiGridItem } from "./templates-ui-grid-item";
import { motion } from "framer-motion";
import { staggerContainer } from "../../lib/animations";

export function TemplatesUiGrid({ templates }: { templates: Template[] }) {
  return (
    <motion.div
      className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {templates.map((template) => (
        <TemplatesUiGridItem
          key={`${template.source.id}-${template.name}`}
          template={template}
        />
      ))}
    </motion.div>
  );
}
