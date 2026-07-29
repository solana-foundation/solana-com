"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@workspace/i18n/use-router";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuDirectLink,
} from "./nav-menu";
import { HEADER_SECTIONS } from "./header-sections";
import { isNavSectionActive } from "./nav-active";

const HeaderList = () => {
  const t = useTranslations();
  const { asPath } = useRouter();
  return (
    <NavigationMenu viewport={false} className="flex-1">
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
              href,
            },
            index,
          ) => {
            const itemClassName = `w-full xl:w-auto ${
              index === HEADER_SECTIONS.length - 1
                ? ""
                : "border-b xl:border-b-0 border-white/10"
            }`;
            const isActive = isNavSectionActive(asPath, matchRules);

            if (href) {
              return (
                <NavigationMenuItem key={id} className={itemClassName}>
                  <NavigationMenuDirectLink to={href} isActive={isActive}>
                    {t(titleKey)}
                  </NavigationMenuDirectLink>
                </NavigationMenuItem>
              );
            }

            if (!Content) {
              return null;
            }

            return (
              <NavigationMenuItem key={id} className={itemClassName} value={id}>
                <NavigationMenuTrigger isActive={isActive}>
                  {t(titleKey)}
                </NavigationMenuTrigger>
                <NavigationMenuContent
                  className={contentClassName}
                  align={contentAlign}
                >
                  <Content />
                </NavigationMenuContent>
              </NavigationMenuItem>
            );
          },
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { HeaderList };
