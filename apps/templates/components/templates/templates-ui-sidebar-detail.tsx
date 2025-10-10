import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";
import {
  RepokitFilter,
  RepokitTemplate,
  useRepokitSourceMap,
  useRepokitTemplateFilters,
} from "@/lib/repokit";
import { Button } from "@/components/ui/button";
import { AppModal } from "@/components/app-modal";
import { TemplatesUiGenerateCommand } from "./templates-ui-generate-command";

export function TemplatesUiSidebarDetail({
  template,
}: {
  template: RepokitTemplate;
}) {
  const sourceMap = useRepokitSourceMap();
  const filters: RepokitFilter[] = useRepokitTemplateFilters({ template });

  return (
    <div className="flex flex-col gap-4">
      <div className="">
        <Button variant="link" className="pl-0" asChild>
          <Link href="/developers/templates">Back to templates</Link>
        </Button>
      </div>
      <div className="border rounded-lg p-4 space-y-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">{template.name}</h3>
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
        <AppModal title="Generate">
          <div className="space-y-4  overflow-x-auto">
            <p>
              Generate a new Solana project using the{" "}
              <strong>{template.name}</strong> template.
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
