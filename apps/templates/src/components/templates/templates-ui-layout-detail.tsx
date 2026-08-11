"use client";

import Link from "next/link";
import { Button } from "@workspace/ui";
import { AppHero } from "../app-hero";
import { TemplatesUiImage } from "../../lib/templates";
import { TemplatesUiSidebarDetail } from "./templates-ui-sidebar-detail";
import { Template } from "../../lib/types/templates";
import { PROSE_README_CLASSNAME } from "../../lib/prose-styles";

export function TemplatesUiLayoutDetail({
  name,
  source,
  templates,
}: {
  name: string;
  source: string;
  templates: Template[];
}) {
  const template = templates.find(
    (t) => t.name === name && t.source.id === source,
  );

  if (!template) {
    return (
      <div>
        <AppHero
          title="Not Found"
          subtitle={`Template "${source}/${name}" not found.`}
        />
        <div className="text-center">
          <Button asChild>
            <Link href="/developers/templates">Back to templates</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1440px] border-b border-white/[0.08] xl:border-x">
      <header className="border-b border-white/[0.08] px-5 pb-14 pt-12 md:px-8 md:pb-20 md:pt-16 xl:px-12 xl:pb-24 xl:pt-20">
        <Link
          href="/developers/templates"
          className="inline-flex items-center font-brand-mono text-[11px] font-medium uppercase tracking-[0.08em] text-nd-mid-em-text transition-colors hover:text-white"
        >
          ← Back to templates
        </Link>
        <h1 className="nd-heading-2xl mt-8 max-w-5xl text-nd-high-em-text">
          {template.displayName || template.name}
        </h1>
        <p className="mt-5 max-w-2xl nd-body-l text-nd-mid-em-text md:mt-6">
          {template.description}
        </p>
      </header>

      <div className="border-b border-white/[0.08] p-3 md:p-8 xl:p-12">
        <div className="relative overflow-hidden border border-white/[0.12] bg-black shadow-[0_32px_100px_rgba(0,0,0,0.45)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(202,159,245,0.08),transparent_60%)] pointer-events-none" />
          <div className="relative flex w-full items-center justify-center">
            <TemplatesUiImage
              template={template}
              className="h-auto w-full"
              sizes="(max-width: 768px) 100vw, 1344px"
              priority
            />
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="border-b border-white/[0.08] p-5 md:p-8 xl:border-b-0 xl:border-r xl:p-10">
          <div className="xl:sticky xl:top-20">
            <TemplatesUiSidebarDetail template={template} />
          </div>
        </aside>
        <article className="min-w-0 overflow-hidden p-5 md:p-8 xl:p-12">
          <div className={PROSE_README_CLASSNAME}>
            <div dangerouslySetInnerHTML={{ __html: template.readme }} />
          </div>
        </article>
      </div>
    </section>
  );
}
