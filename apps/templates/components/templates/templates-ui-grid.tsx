import { RepokitTemplate } from "@/lib/repokit";
import { TemplatesUiGridItem } from "./templates-ui-grid-item";

export function TemplatesUiGrid({
  templates,
}: {
  templates: RepokitTemplate[];
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template, index) => (
        <TemplatesUiGridItem key={index} template={template} />
      ))}
    </div>
  );
}
