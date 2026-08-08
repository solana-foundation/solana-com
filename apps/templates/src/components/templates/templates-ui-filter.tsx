import { TemplatesUiFilterHeader } from "./templates-ui-filter-header";
import { TemplatesUiFilterKeywords } from "./templates-ui-filter-keywords";
import { TemplatesUiFilterSearch } from "./templates-ui-filter-search";

export function TemplatesUiFilter() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-nd-border-light bg-[#0D0C11]">
      {/* Soft brand glow */}
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(ellipse_at_top_left,rgba(202,159,245,0.05),transparent_60%)] pointer-events-none" />

      <div className="relative flex flex-col gap-4 px-4 py-6">
        <TemplatesUiFilterHeader />
        <TemplatesUiFilterSearch />
        <TemplatesUiFilterKeywords />
      </div>
    </div>
  );
}
