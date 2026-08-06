import { Button } from "@workspace/ui";
import { useTemplateFilterState } from "../../lib/templates";
import { useTemplatesTranslations } from "../../lib/use-translations";
import { X } from "@boxicons/react/X";

export function TemplatesUiFilterHeader() {
  const { clear, isFiltered } = useTemplateFilterState();
  const t = useTemplatesTranslations();

  return (
    <div className="flex justify-between items-center gap-2">
      <span className="font-brand-mono text-[11px] leading-[1.42] font-bold uppercase tracking-wide text-nd-high-em-text py-1.5 whitespace-nowrap">
        {t("filter.title")}
      </span>
      {isFiltered ? (
        <Button
          variant="ghost"
          onClick={() => clear()}
          className="cursor-pointer h-auto py-1 px-2 text-xs flex-shrink-0 gap-1 text-nd-mid-em-text hover:text-nd-high-em-text"
        >
          <X className="h-1 w-2" />
          {t("filter.clear")}
        </Button>
      ) : null}
    </div>
  );
}
