"use client";

import React from "react";
import { Navigation } from "@solana/ui-components";
import { useTranslations } from "next-intl";
import { useRouter } from "@@/src/hooks/useRouter";
import { InkeepSearchBar } from "@@/src/app/components/inkeep/inkeep-searchbar";
import { useTheme } from "@/themecontext";
import SolanaLogo from "../../public/src/img/logos-solana/logotype.inline.svg";
import Moon from "../../public/src/img/icons/Moon.inline.svg";
import Sun from "../../public/src/img/icons/Sun.inline.svg";
import { NavigationItem } from "@solana/ui-components";

import DevelopersSVG from "../../assets/nav/build/developers.inline.svg";
import MoreSVG from "../../assets/nav/build/cases.inline.svg";
import StartSVG from "../../assets/nav/learn/start.inline.svg";
import SolutionsToolsSVG from "../../assets/nav/solutions/solutions.inline.svg";
import SolutionsCasesSVG from "../../assets/nav/solutions/cases.inline.svg";
import SolutionsResourcesSVG from "../../assets/nav/solutions/resources.inline.svg";
import ResourcesSVG from "../../assets/nav/network/resources.inline.svg";
import InspectSVG from "../../assets/nav/network/inspect.inline.svg";
import InvolvedSVG from "../../assets/nav/community/involved.inline.svg";
import BreakpointLogo from "../../assets/nav/community/breakpoint-logo.inline.svg";

interface NavigationAdapterProps {
  className?: string;
  containerClassName?: string;
}

export const NavigationAdapter: React.FC<NavigationAdapterProps> = ({
  className = "",
  containerClassName = "",
}) => {
  const router = useRouter();
  const { theme, toggleTheme, isThemePage } = useTheme();
  const t = useTranslations();

  const isLearnActive = (pathname: string) =>
    pathname.includes("/learn") || pathname === "/environment";

  const isSolutionsActive = (pathname: string) =>
    pathname.includes("/solutions") ||
    pathname.includes("/wallets") ||
    pathname.includes("/ai");

  const isBuildActive = (pathname: string) =>
    pathname.includes("/developers") ||
    pathname.includes("/docs") ||
    pathname === "/hackathon";

  const isNetworkActive = (pathname: string) =>
    pathname === "/validators" ||
    pathname === "/rpc" ||
    pathname === "/solanaramp";

  const isCommunityActive = (pathname: string) =>
    pathname === "/community" ||
    pathname.includes("/events") ||
    pathname === "/breakpoint" ||
    pathname === "/news";

  const navigationItems: NavigationItem[] = [
    {
      label: t("nav.learn.title"),
      color: "#19fb9b",
      isActive: isLearnActive,
      icon: <StartSVG className="w-5 h-5" />,
      children: [
        {
          title: t("nav.learn.start.title"),
          icon: <StartSVG className="w-4 h-4" />,
          items: [
            {
              label: t("nav.learn.start.items.all.title"),
              href: "/learn",
              description: t("nav.learn.start.items.all.description"),
            },
            {
              label: t("learn.tutorials.items.what-is-solana.title"),
              href: "/learn/what-is-solana",
              description: t(
                "nav.learn.start.items.what-is-solana.description",
              ),
            },
            {
              label: t("learn.tutorials.items.what-is-a-wallet.title"),
              href: "/learn/what-is-a-wallet",
              description: t("nav.learn.start.items.wallet.description"),
            },
            {
              label: t(
                "learn.tutorials.items.introduction-to-defi-on-solana.title",
              ),
              href: "/learn/introduction-to-defi-on-solana",
              description: t("nav.learn.start.items.defi.description"),
            },
          ],
        },
      ],
    },
    {
      label: t("nav.developers.title"),
      color: "#fed612",
      isActive: isBuildActive,
      icon: <DevelopersSVG className="w-5 h-5" />,
      children: [
        {
          title: t("nav.developers.items.title"),
          icon: <DevelopersSVG className="w-4 h-4" />,
          columnWidth: "wide",
          items: [
            {
              label: t("nav.developers.items.docs.title"),
              href: "/docs",
              description: t("nav.developers.items.docs.description"),
            },
            {
              label: t("nav.developers.items.api.title"),
              href: "/docs/rpc",
              description: t("nav.developers.items.api.description"),
            },
            {
              label: t("nav.developers.items.cookbook.title"),
              href: "/developers/cookbook",
              description: t("nav.developers.items.cookbook.description"),
            },
            {
              label: t("nav.developers.items.hub.title"),
              href: "/developers",
              description: t("nav.developers.items.hub.description"),
            },
          ],
        },
        {
          title: t("nav.developers.tutorials.title"),
          icon: <MoreSVG className="w-4 h-4" />,
          divider: true,
          columnWidth: "compact",
          items: [
            {
              label: t("nav.developers.tutorials.hello-world"),
              href: "/docs/intro/quick-start",
            },
            {
              label: t("nav.developers.tutorials.local-setup"),
              href: "/docs/intro/installation",
            },
            {
              label: t("nav.developers.tutorials.evm-to-svm"),
              href: "/developers/evm-to-svm",
            },
          ],
        },
      ],
    },
    {
      label: t("nav.solutions.title"),
      color: "#FF5722",
      isActive: isSolutionsActive,
      icon: <SolutionsToolsSVG className="w-5 h-5" />,
      children: [
        {
          title: t("nav.solutions.tools.title"),
          icon: <SolutionsToolsSVG className="w-4 h-4" />,
          columnWidth: "normal",
          items: [
            {
              label: t.raw("nav.solutions.tools.items")[0].title,
              href: "/solutions/token-extensions",
            },
            {
              label: t.raw("nav.solutions.tools.items")[9].title,
              href: "/solutions/actions",
            },
            {
              label: t.raw("nav.solutions.tools.items")[10].title,
              href: "/wallets",
            },
            {
              label: t.raw("nav.solutions.tools.items")[7].title,
              href: "/solutions/solana-permissioned-environments",
            },
            {
              label: t.raw("nav.solutions.tools.items")[1].title,
              href: "/solutions/games-tooling",
            },
            {
              label: t.raw("nav.solutions.tools.items")[2].title,
              href: "/solutions/payments-tooling",
            },
            {
              label: t.raw("nav.solutions.tools.items")[3].title,
              href: "/solutions/commerce-tooling",
            },
            {
              label: t.raw("nav.solutions.tools.items")[4].title,
              href: "/solutions/financial-infrastructure",
            },
            {
              label: t.raw("nav.solutions.tools.items")[5].title,
              href: "/solutions/digital-assets",
            },
            {
              label: t.raw("nav.solutions.tools.items")[8].title,
              href: "/solutions/real-world-assets",
            },
            {
              label: t.raw("nav.solutions.tools.items")[6].title,
              href: "https://solanamobile.com/developers",
              isExternal: true,
            },
          ],
        },
        {
          title: t("nav.solutions.cases.title"),
          icon: <SolutionsCasesSVG className="w-4 h-4" />,
          divider: true,
          columnWidth: "compact",
          items: [
            {
              label: t.raw("nav.solutions.cases.items")[5].title,
              href: "/solutions/tokenization",
            },
            {
              label: t.raw("nav.solutions.cases.items")[4].title,
              href: "/solutions/depin",
            },
            {
              label: t.raw("nav.solutions.cases.items")[6].title,
              href: "/solutions/btcfi",
            },
            {
              label: t.raw("nav.solutions.cases.items")[1].title,
              href: "/solutions/enterprise",
            },
            {
              label: t.raw("nav.solutions.cases.items")[0].title,
              href: "/solutions/gaming-and-entertainment",
            },
            {
              label: t.raw("nav.solutions.cases.items")[2].title,
              href: "/solutions/artists-creators",
            },
          ],
        },
        {
          title: t("nav.solutions.resources.title"),
          icon: <SolutionsResourcesSVG className="w-4 h-4" />,
          items: [
            {
              label: t.raw("nav.solutions.resources.items")[0].title,
              href: "/solutions",
            },
            {
              label: t.raw("nav.solutions.resources.items")[1].title,
              href: "/ai",
            },
            {
              label: t.raw("nav.solutions.resources.items")[2].title,
              href: "/developers/dao",
            },
          ],
        },
      ],
    },
    {
      label: t("nav.network.title"),
      color: "#9945ff",
      isActive: isNetworkActive,
      icon: <ResourcesSVG className="w-5 h-5" />,
      children: [
        {
          title: t("nav.network.resources.title"),
          icon: <ResourcesSVG className="w-4 h-4" />,
          columnWidth: "wide",
          items: [
            {
              label: t.raw("nav.network.resources.items")[0].title,
              href: "/validators",
              description: t.raw("nav.network.resources.items")[0].description,
            },
            {
              label: t.raw("nav.network.resources.items")[1].title,
              href: "/rpc",
              description: t.raw("nav.network.resources.items")[1].description,
            },
            {
              label: t.raw("nav.network.resources.items")[2].title,
              href: "https://status.solana.com/",
              isExternal: true,
              description: t.raw("nav.network.resources.items")[2].description,
            },
            {
              label: t.raw("nav.network.resources.items")[3].title,
              href: "/solanaramp",
              description: t.raw("nav.network.resources.items")[3].description,
            },
          ],
        },
        {
          title: t("nav.network.inspect.title"),
          icon: <InspectSVG className="w-4 h-4" />,
          divider: true,
          columnWidth: "compact",
          items: [
            {
              label: t.raw("nav.network.inspect.items")[0].title,
              href: "https://solscan.io/",
              isExternal: true,
              description: t.raw("nav.network.inspect.items")[0].description,
            },
            {
              label: t.raw("nav.network.inspect.items")[1].title,
              href: "https://solana.fm/",
              isExternal: true,
              description: t.raw("nav.network.inspect.items")[1].description,
            },
            {
              label: t.raw("nav.network.inspect.items")[2].title,
              href: "https://explorer.solana.com/",
              isExternal: true,
              description: t.raw("nav.network.inspect.items")[2].description,
            },
          ],
        },
      ],
    },
    {
      label: t("nav.community.title"),
      color: "#f087ff",
      isActive: isCommunityActive,
      icon: <InvolvedSVG className="w-5 h-5" />,
      children: [
        {
          title: t("nav.community.involved.title"),
          icon: <InvolvedSVG className="w-4 h-4" />,
          columnWidth: "wide",
          items: [
            {
              label: t.raw("nav.community.involved.items")[0].title,
              href: "/news",
              description: t.raw("nav.community.involved.items")[0].description,
            },
            {
              label: t.raw("nav.community.involved.items")[1].title,
              href: "/events",
              description: t.raw("nav.community.involved.items")[1].description,
            },
            {
              label: t.raw("nav.community.involved.items")[2].title,
              href: "https://www.solanacollective.com/",
              isExternal: true,
              description: t.raw("nav.community.involved.items")[2].description,
            },
            {
              label: t.raw("nav.community.involved.items")[3].title,
              href: "/community",
              description: t.raw("nav.community.involved.items")[3].description,
            },
          ],
        },
        {
          title: t("nav.community.event.title"),
          divider: true,
          columnWidth: "compact",
          items: [
            {
              label: "Breakpoint 2025",
              href: "/breakpoint",
              description: "Dec. 11-13, 2025 - ABU DHABI",
              image: <BreakpointLogo className="w-full max-w-[200px]" />,
            },
          ],
        },
      ],
    },
  ];

  const logo = (
    <SolanaLogo style={{ color: "var(--body-text)" }} width={149} height={22} />
  );

  const themeToggle = isThemePage ? (
    <button
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      onClick={toggleTheme}
      aria-label={t("commands.toggle")}
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  ) : null;

  return (
    <Navigation
      items={navigationItems}
      logo={logo}
      logoHref="/"
      searchBar={
        <div className="flex items-center h-full">
          <InkeepSearchBar />
        </div>
      }
      themeToggle={themeToggle}
      currentPath={router.asPath}
      className={className}
      containerClassName={containerClassName}
      darkMode={theme === "dark"}
    />
  );
};
