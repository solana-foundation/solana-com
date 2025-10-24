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
      <div className="grid md:grid-cols-4 gap-4 lg:gap-8">
        <aside className="md:col-span-1">
          <div className="hidden md:block md:sticky md:top-20 md:max-h-[calc(100vh-6rem)] md:overflow-y-auto custom-scrollbar">
            <TemplatesUiFilter />
          </div>
          <div className="md:hidden">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  {t("filter.mobile_accordion")}
                </AccordionTrigger>
                <AccordionContent>
                  <TemplatesUiFilter />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </aside>
        <main className="md:col-span-3">
          <TemplatesUiMain />
        </main>
      </div>
    </TemplatesProvider>
  );
}
