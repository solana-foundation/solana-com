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
import { isNavSectionActive } from "./nav-active";

const HeaderList = () => {
  const t = useTranslations();
  const { asPath } = useRouter();

  return (
    <NavigationMenu viewport={false} className="flex-1">
      <NavigationMenuList className="flex-wrap gap-2 xl:items-center pl-0">
        {HEADER_SECTIONS.map(
          ({
            id,
            titleKey,
            matchRules,
            contentAlign = "left",
            contentClassName,
            Content,
          }, index) => (
            <NavigationMenuItem
              key={id}
              className={`w-full xl:w-auto ${
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
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { HeaderList };
