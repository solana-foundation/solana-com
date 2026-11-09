"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@workspace/i18n/use-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "./nav-menu";
import { HEADER_SECTIONS } from "./header-sections";
import { DevelopersLink } from "./developers-link";
import { isNavSectionActive } from "./nav-active";

const HeaderList = () => {
  const t = useTranslations();
  const { asPath } = useRouter();
  return (
    <NavigationMenu
      viewport={false}
      className="w-full max-w-none flex-1 [&>div]:w-full"
    >
      <NavigationMenuList className="flex-wrap gap-2 xl:gap-1 xl:items-center pl-0">
        {HEADER_SECTIONS.map(
          (
            {
              id,
              titleKey,
              matchRules,
              contentAlign = "left",
              contentClassName,
              Content,
            },
            index,
          ) => (
            <NavigationMenuItem
              key={id}
              className={`w-full xl:static xl:w-auto ${
                index === HEADER_SECTIONS.length - 1
                  ? ""
                  : "border-b xl:border-b-0 border-white/10"
              }`}
              value={id}
            >
              <NavigationMenuTrigger
                isActive={isNavSectionActive(asPath, matchRules)}
              >
                {t(titleKey)}
              </NavigationMenuTrigger>
              <NavigationMenuContent
                className={contentClassName}
                align={contentAlign}
              >
                <Content />
              </NavigationMenuContent>
            </NavigationMenuItem>
          ),
        )}
        {/* Plain link right of Ecosystem; opens /developers in a new tab. */}
        <NavigationMenuItem className="w-full xl:static xl:w-auto">
          <DevelopersLink className="inline-flex h-9 items-center rounded-full px-4 py-1.5 text-[16px] font-normal leading-[1.5] !text-[rgba(255,255,255,0.64)] outline-none transition-colors duration-200 hover:bg-white/[0.08] hover:!text-white focus-visible:bg-white/[0.08] focus-visible:!text-white focus-visible:ring-[3px] focus-visible:ring-white/30 xl:px-3.5 xl:py-1 xl:text-[15px]" />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { HeaderList };
