import { Button } from "@workspace/ui";
import { useTemplateFilterState } from "../../lib/templates";
import { useTemplatesTranslations } from "../../lib/use-translations";
import { X } from "@boxicons/react/X";

export function TemplatesUiFilterHeader() {
  const { clear, isFiltered } = useTemplateFilterState();
  const t = useTemplatesTranslations();

  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
      <span className="whitespace-nowrap font-brand-mono text-[12px] font-medium uppercase tracking-[0.08em] text-nd-high-em-text">
        {t("filter.title")}
      </span>
      {isFiltered ? (
        <Button
          variant="ghost"
          onClick={() => clear()}
          className="h-auto flex-shrink-0 cursor-pointer gap-1 px-2 py-1 text-xs text-nd-mid-em-text hover:bg-white/[0.06] hover:text-nd-high-em-text"
        >
          <X className="size-3" />
          {t("filter.clear")}
        </Button>
      ) : null}
    </div>
  );
}
