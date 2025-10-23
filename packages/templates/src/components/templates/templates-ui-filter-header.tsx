import { Button } from "../ui/button";
import { useTemplateFilterState } from "../../lib/templates";
import { useTemplatesTranslations } from "../../lib/use-translations";
import { X } from "lucide-react";

export function TemplatesUiFilterHeader() {
  const { clear, isFiltered } = useTemplateFilterState();
  const t = useTemplatesTranslations();

  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-sm font-bold py-1.5 whitespace-nowrap">
        {t("filter.title")}
      </span>
      {isFiltered ? (
        <Button
          variant="ghost"
          onClick={() => clear()}
          className="cursor-pointer h-auto py-1 px-2 text-xs flex-shrink-0 gap-1"
        >
          <X className="h-1 w-2" />
          {t("filter.clear")}
        </Button>
      ) : null}
    </div>
  );
}
