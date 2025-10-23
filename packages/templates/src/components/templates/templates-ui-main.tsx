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
    <div className="flex flex-col items-center justify-center gap-8 border border-white/5 py-32 rounded-lg p-4 text-center">
      <div className="font-bold text-lg">{t("empty_state.title")}</div>
      <Button variant="outline" onClick={clear}>
        {t("empty_state.clear_filters")}
      </Button>
    </div>
  );
}
