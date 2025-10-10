import { RepokitTemplate, TemplatesUiImage } from "@/lib/repokit";
import Link from "next/link";
import { ExternalLinkIcon } from "lucide-react";

export function TemplatesUiGridItem({
  template,
}: {
  template: RepokitTemplate;
}) {
  return (
    <Link
      href={`/developers/templates/${template.source.id}/${template.name}`}
      className="border rounded-3xl overflow-hidden bg-purple-950/5"
      passHref
    >
      <div className="flex items-center justify-center">
        <TemplatesUiImage template={template} />
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold">{template.name}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {template.description}
        </p>
        <div className="flex justify-between items-center">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            by {template.source.name}
          </p>
          <button
            onClick={(e) => {
              e.preventDefault();
              return window.open(
                template.repoUrl,
                "_blank",
                "noopener,noreferrer",
              );
            }}
            title="View Repo"
            role="link"
            aria-label="View Repo"
            type="button"
            className="text-sm flex items-center gap-1 hover:underline"
          >
            <ExternalLinkIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
