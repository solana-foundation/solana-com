import { TemplatesUiImage } from "../../lib/templates/templates-ui-image";
import type { Template } from "../../lib/types/templates";

export function TemplatesUiHeroVisual({
  templates,
}: {
  templates: Template[];
}) {
  const [primaryTemplate, secondaryTemplate] = templates;

  if (!primaryTemplate) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(202,159,245,0.14),transparent_48%)]" />

      {secondaryTemplate ? (
        <div className="absolute left-8 top-16 w-[72%] -rotate-3 border border-white/[0.08] bg-[#0C0C0E]/80 opacity-60 shadow-2xl">
          <div className="flex h-8 items-center gap-1.5 border-b border-white/[0.08] px-3">
            <span className="size-1.5 rounded-full bg-white/20" />
            <span className="size-1.5 rounded-full bg-white/15" />
            <span className="size-1.5 rounded-full bg-white/10" />
          </div>
          <div className="relative aspect-[1200/630] overflow-hidden">
            <TemplatesUiImage
              template={secondaryTemplate}
              className="h-full w-full object-cover object-top"
              sizes="340px"
            />
          </div>
        </div>
      ) : null}

      <div className="relative ml-12 mt-16 w-full border border-white/[0.16] bg-[#0C0C0E] shadow-[0_32px_100px_rgba(0,0,0,0.65)]">
        <div className="flex h-10 items-center justify-between border-b border-white/[0.08] px-4">
          <div className="flex gap-1.5">
            <span className="size-1.5 rounded-full bg-nd-highlight-lavendar/70" />
            <span className="size-1.5 rounded-full bg-nd-highlight-blue/50" />
            <span className="size-1.5 rounded-full bg-nd-highlight-green/60" />
          </div>
          <span className="h-px w-16 bg-white/10" />
        </div>
        <div className="relative aspect-[1200/630] overflow-hidden bg-white/[0.03]">
          <TemplatesUiImage
            template={primaryTemplate}
            className="h-full w-full object-cover object-top"
            sizes="390px"
            priority
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/[0.06]" />
        </div>
        <div className="grid grid-cols-[1fr_72px] border-t border-white/[0.08]">
          <div className="space-y-2 px-4 py-4">
            <div className="h-1.5 w-28 rounded-full bg-white/25" />
            <div className="h-1.5 w-40 rounded-full bg-white/10" />
          </div>
          <div className="flex items-center justify-center border-l border-white/[0.08]">
            <span className="size-7 rounded-full border border-white/20 bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </div>
  );
}
