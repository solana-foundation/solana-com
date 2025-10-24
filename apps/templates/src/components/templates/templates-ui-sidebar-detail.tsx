import { Github } from "lucide-react";
import {
  TemplateFilter,
  Template,
  useTemplateSourceMap,
  useTemplateFilters,
} from "../../lib/templates";
import { AppModal } from "../app-modal";
import { TemplatesUiGenerateCommand } from "./templates-ui-generate-command";

export function TemplatesUiSidebarDetail({ template }: { template: Template }) {
  const sourceMap = useTemplateSourceMap();
  const filters: TemplateFilter[] = useTemplateFilters({ template });

  return (
    <div className="flex flex-col gap-4">
      <div className="relative overflow-hidden rounded-2xl">
        {/* Gradient border effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20" />
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-950" />

        <div className="relative flex flex-col gap-4 px-4 py-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold leading-none">
                  {template.displayName || template.name}
                </h3>
              </div>
              <a
                href={template.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-purple-400 transition-colors flex-shrink-0 flex items-center"
                title="View on GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-neutral-500">{template.description}</p>
          </div>
          <div className="space-y-2">
            <p className="flex justify-between text-sm">
              <strong>Author:</strong>
              <span>{sourceMap[template.source.name]?.name}</span>
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
          <AppModal title="Use This Template" hideTitle>
            <div className="space-y-4  overflow-x-auto">
              <p>
                Generate a new Solana project using the{" "}
                <strong>{template.displayName || template.name}</strong>{" "}
                template.
              </p>
              <TemplatesUiGenerateCommand template={template} />
              <p>Run the command above in your terminal to get started.</p>
            </div>
          </AppModal>
        </div>
      </div>
    </div>
  );
}
