"use client";

import { Template } from "../../lib/templates";
import { TemplatesUiGridItem } from "./templates-ui-grid-item";

export function TemplatesUiGrid({ templates }: { templates: Template[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
      {templates.map((template) => (
        <TemplatesUiGridItem
          key={`${template.source.id}-${template.name}`}
          template={template}
        />
      ))}
    </div>
  );
}
