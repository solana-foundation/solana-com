"use client";

import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui";
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
    <div>
      <div className="md:col-span-3 gap-4">
        <div>
          <div>
            <div className="max-w-5xl mx-auto mb-4">
              <Button
                asChild
                variant="ghost"
                className="mb-4 px-2 text-nd-mid-em-text hover:text-nd-high-em-text hover:bg-nd-border-light"
              >
                <Link href="/developers/templates">← Back to templates</Link>
              </Button>
              <h1 className="nd-heading-l text-nd-high-em-text mb-6">
                {template.displayName || template.name}
              </h1>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-nd-border-light bg-black mb-4 max-w-5xl mx-auto">
              {/* Soft brand glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(202,159,245,0.06),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent pointer-events-none" />

              <div className="relative w-full max-h-96 flex items-center justify-center">
                <TemplatesUiImage template={template} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-8 max-w-5xl mx-auto">
            <div className="col-span-2">
              <div className="hidden md:block md:sticky md:top-0 md:self-start">
                <TemplatesUiSidebarDetail template={template} />
              </div>
              <div className="md:hidden ">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem
                    value="item-1"
                    className="border-nd-border-light"
                  >
                    <AccordionTrigger className="text-nd-high-em-text hover:no-underline font-medium">
                      Template details
                    </AccordionTrigger>
                    <AccordionContent>
                      <TemplatesUiSidebarDetail template={template} />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="col-span-2 md:col-span-3 relative overflow-hidden rounded-2xl border border-nd-border-light bg-[#0D0C11]">
              {/* Soft brand glow */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(202,159,245,0.04),transparent_60%)] pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

              <div className={`relative ${PROSE_README_CLASSNAME}`}>
                <div dangerouslySetInnerHTML={{ __html: template.readme }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
