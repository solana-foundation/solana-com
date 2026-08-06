import { Button } from "@workspace/ui";
import { useTemplateFilterState } from "../../lib/templates";
import { useTemplatesTranslations } from "../../lib/use-translations";
import { TemplatesUiGrid } from "./templates-ui-grid";

export function TemplatesUiMain() {
  const { clear, templates } = useTemplateFilterState();
  const t = useTemplatesTranslations();

  return templates.length ? (
    <TemplatesUiGrid templates={templates} />
  ) : (
    <div className="flex flex-col items-center justify-center gap-8 border border-nd-border-light py-32 rounded-2xl p-4 text-center bg-[#0D0C11]">
      <div className="nd-heading-s text-nd-high-em-text">
        {t("empty_state.title")}
      </div>
      <Button
        variant="outline"
        onClick={clear}
        className="border-nd-border-prominent text-nd-high-em-text hover:bg-nd-border-prominent dark:bg-transparent dark:hover:bg-nd-border-prominent"
      >
        {t("empty_state.clear_filters")}
      </Button>
    </div>
  );
}
