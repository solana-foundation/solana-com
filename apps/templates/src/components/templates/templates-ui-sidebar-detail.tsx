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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
        <h2 className="font-brand-mono text-[12px] font-medium uppercase tracking-[0.08em] text-white">
          Template details
        </h2>
        <a
          href={template.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-nd-mid-em-text transition-colors hover:text-white"
          title="View on GitHub"
        >
          <Github className="size-4" />
          GitHub
        </a>
      </div>

      <dl className="space-y-4">
        <div className="flex justify-between gap-5 text-sm">
          <dt className="text-nd-mid-em-text">Author</dt>
          <dd className="text-right text-nd-high-em-text">
            {sourceMap[template.source.name]?.name}
          </dd>
        </div>
        {filters.map((filter) => (
          <div key={filter.id} className="flex justify-between gap-5 text-sm">
            <dt className="text-nd-mid-em-text">{filter.name}</dt>
            <dd className="max-w-[170px] text-right text-nd-high-em-text">
              {filter.keywords.map((keyword) => keyword.name).join(", ")}
            </dd>
          </div>
        ))}
      </dl>

      <AppModal title="Use This Template" hideTitle>
        <div className="space-y-4 overflow-x-auto">
          <p>
            Generate a new Solana project using the{" "}
            <strong>{template.displayName || template.name}</strong> template.
          </p>
          <TemplatesUiGenerateCommand template={template} />
          <p>Run the command above in your terminal to get started.</p>
        </div>
      </AppModal>
    </div>
  );
}
