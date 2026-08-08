import { Github } from "@boxicons/react/Github";
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
      <div className="relative overflow-hidden rounded-2xl border border-nd-border-light bg-[#0D0C11]">
        {/* Soft brand glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(202,159,245,0.05),transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

        <div className="relative flex flex-col gap-4 px-4 py-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h3 className="text-[17px] font-medium leading-none text-nd-high-em-text">
                  {template.displayName || template.name}
                </h3>
              </div>
              <a
                href={template.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-nd-mid-em-text hover:text-nd-high-em-text transition-colors flex-shrink-0 flex items-center"
                title="View on GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
            <p className="text-sm text-nd-mid-em-text">
              {template.description}
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex justify-between gap-4 text-sm">
              <strong className="font-medium text-nd-mid-em-text">
                Author:
              </strong>
              <span className="text-nd-high-em-text text-right">
                {sourceMap[template.source.name]?.name}
              </span>
            </p>
            {filters.map((filters) => (
              <div
                key={filters.id}
                className="flex justify-between gap-4 text-sm"
              >
                <strong className="font-medium text-nd-mid-em-text">
                  {filters.name}:
                </strong>
                <span className="text-nd-high-em-text text-right">
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
