"use client";

import { Template } from "../../lib/templates";
import { TemplatesUiGridItem } from "./templates-ui-grid-item";

export function TemplatesUiGrid({ templates }: { templates: Template[] }) {
  return (
    <div className="grid auto-rows-fr gap-px overflow-hidden border border-white/[0.08] bg-white/[0.08] md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplatesUiGridItem
          key={`${template.source.id}-${template.name}`}
          template={template}
        />
      ))}
    </div>
  );
}
