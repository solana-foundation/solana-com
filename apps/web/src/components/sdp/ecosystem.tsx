"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Logos, Logo as LogoType } from "@/component-library/logos";
import CursorBox from "@@/public/src/img/icons/CursorBox.inline.svg";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipPortal,
} from "@/app/components/ui/tooltip";
import React from "react";

export interface EcosystemInstitution {
  logoSrc: string;
  logoAlt: string;
  name: string;
  description: string;
}

export interface EcosystemCategory {
  id: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  logos: (LogoType & { href: string })[];
}

export interface EcosystemProps {
  title?: string;
  description?: string;
  partnersTitle?: string;
  partnersSubtitle?: string;
  institutions?: EcosystemInstitution[];
  categories?: EcosystemCategory[];
}

export const Ecosystem = ({
  title,
  description,
  partnersTitle,
  partnersSubtitle,
  institutions = [],
  categories = [],
}: EcosystemProps): React.ReactElement => {
  return (
    <section className="relative flex flex-col items-center w-full bg-[#0C0C0E]">
      <div className="relative w-full max-w-[1440px] xl:border-x xl:border-white/[0.08]">
        {/* Row 1 — heading + description */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4 xl:gap-0 px-5 md:px-8 xl:px-12 py-10 md:py-20 border-b border-white/[0.08]">
          <h2 className="nd-heading-l-a text-white xl:w-[575px] xl:flex-none">
            {title}
          </h2>
          <p className="nd-body-l text-white/[0.64] xl:w-[411px] xl:flex-none">
            {description}
          </p>
        </div>

        {/* Row 2 — institution cards */}
        <div className="px-3 xl:px-0 border-b border-white/[0.08] grow-0">
          <div className="flex flex-col xl:flex-row">
            {institutions.map((inst, i) => (
              <div
                key={inst.name}
                className={`flex flex-col gap-3 max-xl:border-x border-white/[0.08] xl:gap-[46px] px-5 md:px-8 xl:px-12 py-6 xl:py-10 flex-1${
                  i < institutions.length - 1
                    ? " border-b xl:border-b-0 xl:border-r"
                    : ""
                }`}
              >
                <div className="h-5 xl:h-10">
                  <img
                    src={inst.logoSrc}
                    alt={inst.logoAlt}
                    className="h-full !w-auto"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="nd-heading-s text-white">{inst.name}</p>
                  <p className="nd-body-s text-white/[0.64]">
                    {inst.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3 — ecosystem section header */}
        <div className="flex flex-col gap-1 px-5 md:px-8 xl:px-12 py-10">
          <p className="nd-body-m font-medium text-white">{partnersTitle}</p>
          <p className="nd-body-s text-white/[0.64]">{partnersSubtitle}</p>
        </div>

        <div className="px-3 xl:px-0 border-t border-white/[0.08] grow-0">
          {/* Row 4 — desktop table / mobile+tablet accordion */}
          <div className="max-xl:border-x border-white/[0.08]">
            {/* Desktop table — xl+ */}
            <div className="hidden xl:flex xl:flex-col">
              {categories.map((cat, i) => (
                <div
                  key={cat.id}
                  className={`flex items-stretch h-20${
                    i < categories.length - 1
                      ? " border-b border-white/[0.08]"
                      : ""
                  }`}
                >
                  {/* Icon cell */}
                  <div className="xl:w-[5.5%] aspect-square flex items-center justify-center border-r border-white/[0.08] shrink-0">
                    <cat.Icon className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                  </div>
                  {/* Category label */}
                  <div className="w-[398px] flex items-center px-6 shrink-0">
                    <span className="nd-body-l text-white whitespace-nowrap">
                      {cat.label}
                    </span>
                  </div>
                  {/* Partner logos */}
                  <div className="flex-1 flex items-center gap-12 px-6 border-l border-white/[0.08] overflow-hidden">
                    <TooltipProvider delayDuration={100}>
                      <Logos
                        className="!justify-start"
                        itemClassName="!mr-6 xl:!mr-12"
                        logos={cat.logos}
                        autoAnimation
                        fadeColor="transparent"
                        speed={50}
                        renderImage={(
                          logo: LogoType & { href: string },
                          logoImage,
                        ) => (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <a
                                className="block h-full text-inherit"
                                href={logo.href}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {logoImage}
                              </a>
                            </TooltipTrigger>
                            <TooltipPortal>
                              <TooltipContent className="!border-none mb-2 !rounded-[47px] !bg-[#1D1D20] !text-white !py-1 !pl-2 !pr-3 flex items-center gap-1.5">
                                <CursorBox className="size-4" />
                                <span className="nd-body-xs">
                                  {logo.href?.replace("https://", "")}
                                </span>
                              </TooltipContent>
                            </TooltipPortal>
                          </Tooltip>
                        )}
                      />
                    </TooltipProvider>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile + tablet accordion — < xl */}
            <Accordion.Root type="single" collapsible className="xl:hidden">
              {categories.map((cat, i) => (
                <Accordion.Item
                  key={cat.id}
                  value={cat.id}
                  className={
                    i < categories.length - 1
                      ? "border-b border-white/[0.08]"
                      : ""
                  }
                >
                  <Accordion.Trigger className="group w-full flex items-center gap-5 pr-2 [&[data-state=open]>svg]:rotate-180 [&[data-state=open]>svg]:text-white h-10 md:h-16">
                    {/* Icon cell */}
                    <div className="aspect-square w-10 md:w-16 flex items-center justify-center border-r border-white/[0.08] shrink-0 grow-0">
                      <cat.Icon className="w-5 h-5 xl:w-6 xl:h-6 text-white" />
                    </div>
                    <span className="nd-body-l text-white flex-1 text-left">
                      {cat.label}
                    </span>
                    <ChevronDown
                      size={20}
                      className="text-white/[0.64] shrink-0 transition-transform duration-200"
                    />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-[accordion-down_0.15s_ease-out] data-[state=closed]:animate-[accordion-up_0.15s_ease-out]">
                    <div className="p-3 border-t border-white/[0.08]">
                      <Logos
                        className="flex items-center h-10 !justify-start"
                        itemClassName="!mr-6 xl:!mr-12"
                        logos={cat.logos}
                        animation={false}
                        fadeColor="transparent"
                        renderImage={(
                          logo: LogoType & { href: string },
                          logoImage,
                        ) => (
                          <a
                            className="block h-full text-inherit"
                            href={logo.href}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {logoImage}
                          </a>
                        )}
                      />
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </div>
        </div>
      </div>
    </section>
  );
};
