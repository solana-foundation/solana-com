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
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-8 border border-white/[0.08] bg-[#0C0C0E] p-6 text-center">
      <div className="nd-heading-s text-nd-high-em-text">
        {t("empty_state.title")}
      </div>
      <Button
        variant="outline"
        onClick={clear}
        className="rounded-none border-white/20 bg-white text-black hover:bg-white/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
      >
        {t("empty_state.clear_filters")}
      </Button>
    </div>
  );
}
