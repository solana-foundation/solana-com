import { Link } from "./link";
import { Home as StartIcon } from "@boxicons/react/Home";
import { CreditCard as PaymentsIcon } from "@boxicons/react/CreditCard";
import { Layers as AssetsIcon } from "@boxicons/react/Layers";
import { TrendingUp as MarketsIcon } from "@boxicons/react/TrendingUp";
import { Cube as ConceptsIcon } from "@boxicons/react/Cube";
import { Grid as ResourcesIcon } from "@boxicons/react/Grid";
import { Code as ApiIcon } from "@boxicons/react/Code";
import { Play as VideoIcon } from "@boxicons/react/Play";
import { useTranslations } from "next-intl";
import { useRouter } from "@workspace/i18n/use-router";
import {
  DOCS_SIDEBAR_TOGGLE_SLOT_ID,
  DocsSidebarToggleIcon,
} from "./docs-sidebar-toggle";
import { shouldShowDocsSidebarToggle } from "./developer-routes";
import type { ComponentProps, ComponentType } from "react";

function NavLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="!no-underline !text-[#848895] inline-block shrink-0 rounded-md px-[10px] py-[2px] !border border-transparent hover:!text-white light:hover:!text-gray-900 mr-[5px] last:mr-0"
    />
  );
}

const activeClassName =
  "!text-white light:!text-gray-900 bg-[#0c011d] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]";

type DocsTab = {
  /** developers.nav.* message key. */
  label: string;
  to: string;
  Icon: ComponentType<{
    "aria-hidden"?: boolean | "true";
    height?: number;
    width?: number;
    removePadding?: boolean;
    className?: string;
  }>;
  /** Other docs prefixes that live in this tab. */
  match?: string[];
  /** Prefixes under `to` that belong to another tab. */
  ignore?: string[];
  /** Draw the divider after this tab (between the domain and core tabs). */
  dividerAfter?: boolean;
  /**
   * External-style tab: pushed to the right end of the bar and marked with ↗.
   */
  external?: boolean;
};

/**
 * The docs tabs, in the order of the docs tab bar (apps/docs
 * content/navigation/en.json): Start here · Payments · Assets · Markets | How Solana
 * works · Resources · API · Video tutorials ↗ (right-aligned).
 */
const DOCS_TABS: DocsTab[] = [
  {
    label: "quickstart",
    to: "/developers/docs",
    Icon: StartIcon,
    match: [
      "/developers/docs/intro/coding-with-agents",
      "/developers/docs/quickstart",
      "/developers/docs/research",
    ],
    ignore: [
      "/developers/docs/payments",
      "/developers/docs/assets",
      "/developers/docs/tokens",
      "/developers/docs/tokenization",
      "/developers/docs/defi",
      "/developers/docs/core",
      "/developers/docs/references",
      "/developers/docs/tools",
      "/developers/docs/intro",
      "/developers/docs/programs",
      "/developers/docs/frontend",
      "/developers/docs/rpc",
      "/developers/docs/clients",
      "/developers/docs/video-guides",
    ],
  },
  {
    label: "payments",
    to: "/developers/docs/payments",
    Icon: PaymentsIcon,
  },
  {
    label: "assets",
    to: "/developers/docs/assets",
    Icon: AssetsIcon,
    match: ["/developers/docs/tokens", "/developers/docs/tokenization"],
  },
  {
    label: "markets",
    to: "/developers/docs/defi",
    Icon: MarketsIcon,
    dividerAfter: true,
  },
  {
    label: "howSolanaWorks",
    to: "/developers/docs/core",
    Icon: ConceptsIcon,
    match: ["/developers/docs/references"],
  },
  {
    label: "resources",
    to: "/developers/docs/tools",
    Icon: ResourcesIcon,
    // Every developers/docs/tools page is under Resources > Tools.
    match: [
      "/developers/docs/from-evm",
      "/developers/docs/quickstart",
      "/developers/docs/programs",
      "/developers/docs/frontend",
    ],
  },
  {
    label: "rpc",
    to: "/developers/docs/rpc",
    Icon: ApiIcon,
    match: ["/developers/docs/clients"],
  },
  {
    label: "videoTutorials",
    to: "/developers/docs/video-guides",
    Icon: VideoIcon,
    match: ["/developers/bootcamp"],
    external: true,
  },
];

export function DevelopersNav({
  containerClassName,
}: {
  containerClassName?: string;
}) {
  const t = useTranslations();
  const router = useRouter();
  const pathname = router.asPath.split(/[?#]/)[0];
  const showSidebarToggleSlot = shouldShowDocsSidebarToggle(pathname);

  return (
    <div
      data-developers-nav
      className="sticky top-14 z-40 text-[0.85em] bg-[rgb(18_18_18/95%)] transition-colors duration-300 ease-in-out text-[#ababbc] border-t border-b border-[rgba(255,255,255,0.05)] light:!bg-[rgba(255,255,255,0.95)] light:text-[#7f8391] light:border-[rgba(0,0,0,0.05)]"
    >
      <div
        className={`mx-auto w-full max-w-[1440px] px-4 sm:px-5 xl:px-6 ${containerClassName}`}
      >
        <div className="flex h-[46px] items-center text-[17px] font-light">
          <div className="flex min-w-0 flex-1 items-center">
            {showSidebarToggleSlot ? (
              <div
                id={DOCS_SIDEBAR_TOGGLE_SLOT_ID}
                className="mr-1 relative hidden h-8 w-8 shrink-0 items-center justify-center text-[#848895] md:flex light:text-[#7f8391] [&>button]:text-inherit [&>button:hover]:!text-white light:[&>button:hover]:!text-gray-900 [&[data-toggle-mounted='true']>.docs-sidebar-toggle-fallback]:hidden"
              >
                <span className="inline-flex justify-center items-center w-8 h-8 rounded-md docs-sidebar-toggle-fallback">
                  <DocsSidebarToggleIcon />
                </span>
              </div>
            ) : null}
            <nav className="flex min-w-0 flex-1 items-center overflow-x-auto whitespace-nowrap">
              {DOCS_TABS.map(
                ({
                  label,
                  to,
                  Icon,
                  match,
                  ignore,
                  dividerAfter,
                  external,
                }) => (
                  <span
                    key={to}
                    className={external ? "ml-auto shrink-0 pl-2" : "contents"}
                  >
                    <NavLink
                      partiallyActive
                      to={to}
                      partiallyActiveMatch={match}
                      partiallyActiveIgnore={ignore}
                      activeClassName={activeClassName}
                    >
                      <Icon
                        aria-hidden="true"
                        height={16}
                        width={16}
                        removePadding
                        className="inline-block mr-2"
                      />
                      <span className="align-middle">
                        {t(`developers.nav.${label}`)}
                      </span>
                      {external ? (
                        <span aria-hidden="true" className="ml-1 align-middle">
                          ↗
                        </span>
                      ) : null}
                    </NavLink>
                    {dividerAfter ? (
                      <span
                        aria-hidden="true"
                        className="mx-2 inline-block h-4 w-px shrink-0 bg-[rgba(255,255,255,0.15)] light:bg-[rgba(0,0,0,0.15)]"
                      />
                    ) : null}
                  </span>
                ),
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
