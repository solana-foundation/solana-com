import { TemplatesUiFilterHeader } from "./templates-ui-filter-header";
import { TemplatesUiFilterKeywords } from "./templates-ui-filter-keywords";

export function TemplatesUiFilter() {
  return (
    <div className="flex flex-col gap-4 bg-purple-950/10 rounded-3xl px-4 py-6 border border-neutral-700">
      <TemplatesUiFilterHeader />
      <TemplatesUiFilterKeywords />
    </div>
  );
}
