import { ExternalLinkIcon } from "lucide-react";
import {
  TemplateFilter,
  Template,
  useTemplateSourceMap,
  useTemplateFilters,
} from "../../lib/templates";
import { Button } from "../ui/button";
import { AppModal } from "../app-modal";
import { TemplatesUiGenerateCommand } from "./templates-ui-generate-command";

export function TemplatesUiSidebarDetail({ template }: { template: Template }) {
  const sourceMap = useTemplateSourceMap();
  const filters: TemplateFilter[] = useTemplateFilters({ template });

  return (
    <div className="flex flex-col gap-4">
      <div className="border border-white/5 rounded-lg p-4 space-y-4 bg-zinc-950">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold">
              {template.displayName || template.name}
            </h3>
            {template.usecase && (
              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {template.usecase}
              </span>
            )}
          </div>
          <p className="text-sm text-neutral-500">{template.description}</p>
        </div>
        <div className="space-y-2">
          <p className="flex justify-between text-sm">
            <strong>Author:</strong>
            <span>{sourceMap[template.source.name].name}</span>
          </p>
          {filters.map((filters) => (
            <div key={filters.id} className="flex justify-between text-sm">
              <strong>{filters.name}:</strong>
              <span>
                {filters.keywords.map((keyword) => keyword.name).join(", ")}
              </span>
            </div>
          ))}
        </div>
        <AppModal title="Generate" hideTitle>
          <div className="space-y-4  overflow-x-auto">
            <p>
              Generate a new Solana project using the{" "}
              <strong>{template.displayName || template.name}</strong> template.
            </p>
            <TemplatesUiGenerateCommand template={template} />
            <p>Run the command above in your terminal to get started.</p>
          </div>
        </AppModal>
        <Button className="w-full" asChild variant="outline">
          <a href={template.repoUrl} target="_blank" rel="noopener noreferrer">
            View on GitHub <ExternalLinkIcon className="h-4 w-4 ml-2" />
          </a>
        </Button>
      </div>
    </div>
  );
}
