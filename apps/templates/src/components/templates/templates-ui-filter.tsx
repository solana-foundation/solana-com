import { TemplatesUiFilterHeader } from "./templates-ui-filter-header";
import { TemplatesUiFilterKeywords } from "./templates-ui-filter-keywords";
import { TemplatesUiFilterSearch } from "./templates-ui-filter-search";

export function TemplatesUiFilter() {
  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/30 via-pink-500/20 to-blue-500/30 opacity-50" />
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950" />

      <div className="relative flex flex-col gap-4 px-4 py-6">
        <TemplatesUiFilterHeader />
        <TemplatesUiFilterSearch />
        <TemplatesUiFilterKeywords />
      </div>
    </div>
  );
}
