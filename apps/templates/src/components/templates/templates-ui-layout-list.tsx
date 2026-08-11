"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui";
import { TemplatesUiFilter } from "./templates-ui-filter";
import { TemplatesUiMain } from "./templates-ui-main";
import { Template } from "../../lib/types/templates";
import { TemplatesProvider } from "../../lib/templates/templates-context";
import { useTemplatesTranslations } from "../../lib/use-translations";

export function TemplatesUiLayoutList({
  templates,
}: {
  templates: Template[];
}) {
  const t = useTemplatesTranslations();

  return (
    <TemplatesProvider templates={templates}>
      <section className="mx-auto w-full max-w-[1440px] border-b border-white/[0.08] xl:border-x">
        <div className="grid xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="border-b border-white/[0.08] xl:border-b-0 xl:border-r">
            <div className="hidden px-8 py-10 xl:sticky xl:top-16 xl:block xl:max-h-[calc(100vh-4rem)] xl:overflow-y-auto custom-scrollbar">
              <TemplatesUiFilter />
            </div>
            <div className="px-5 md:px-8 xl:hidden">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-0">
                  <AccordionTrigger className="py-5 font-brand-mono text-[12px] font-medium uppercase tracking-[0.08em] text-nd-high-em-text hover:no-underline">
                    {t("filter.mobile_accordion")}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pb-6">
                      <TemplatesUiFilter />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>
          <div className="min-w-0 p-3 md:p-8 xl:p-10">
            <TemplatesUiMain />
          </div>
        </div>
      </section>
    </TemplatesProvider>
  );
}
