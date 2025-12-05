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
import HeaderListBuild from "./header-list.build";
import HeaderListSolutions from "./header-list.solutions";
import HeaderListNetwork from "./header-list.network";
import { HeaderListCommunity } from "./header-list.community";
import HeaderListLearn from "./header-list.learn";

const HeaderList = () => {
  const t = useTranslations();
  const { asPath } = useRouter();

  const isLearnActive =
    asPath.includes("/learn") ||
    asPath === "/environment" ||
    asPath.includes("/universities");
  const isSolutionsActive =
    asPath.includes("/solutions") ||
    asPath.includes("/wallets") ||
    asPath.includes("/ai");
  const isBuildActive =
    asPath.includes("/developers") ||
    asPath.includes("/docs") ||
    asPath === "/hackathon";
  const isNetworkActive =
    asPath === "/validators" || asPath === "/rpc" || asPath === "/solanaramp";
  const isCommunityActive =
    asPath === "/community" ||
    asPath.includes("/events") ||
    asPath === "/breakpoint" ||
    asPath === "/news" ||
    asPath.includes("/podcasts");

  return (
    <NavigationMenu viewport={false} className="flex-1">
      <NavigationMenuList className="flex-wrap gap-0 xl:items-center !pl-0">
        {/* Learn */}
        <NavigationMenuItem
          className="border-b xl:border-b-0 border-white/10 w-full xl:w-auto"
          activeColor="#19fb9b"
          value="learn"
        >
          <NavigationMenuTrigger isActive={isLearnActive}>
            {t("nav.learn.title")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <HeaderListLearn />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Developers */}
        <NavigationMenuItem
          className="border-b xl:border-b-0 border-white/10 w-full xl:w-auto"
          activeColor="#fed612"
          value="developers"
        >
          <NavigationMenuTrigger isActive={isBuildActive}>
            {t("nav.developers.title")}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <HeaderListBuild />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Solutions */}
        <NavigationMenuItem
          className="border-b xl:border-b-0 border-white/10 w-full xl:w-auto"
          activeColor="#FF5722"
          value="solutions"
        >
          <NavigationMenuTrigger isActive={isSolutionsActive}>
            {t("nav.solutions.title")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="xl:overflow-y-auto xl:max-h-[90vh]">
            <HeaderListSolutions />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Network */}
        <NavigationMenuItem
          className="border-b xl:border-b-0 border-white/10 w-full xl:w-auto"
          activeColor="#9945ff"
          value="network"
        >
          <NavigationMenuTrigger isActive={isNetworkActive}>
            {t("nav.network.title")}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="xl:-ml-[120px]">
            <HeaderListNetwork />
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Community */}
        <NavigationMenuItem
          className="w-full xl:w-auto"
          activeColor="#f087ff"
          value="community"
        >
          <NavigationMenuTrigger isActive={isCommunityActive}>
            {t("nav.community.title")}
          </NavigationMenuTrigger>
          <NavigationMenuContent align="right">
            <HeaderListCommunity />
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export { HeaderList };
