import { Link } from "./link";
import { BookOpen as DocsIcon } from "@boxicons/react/BookOpen";
import { Code as RpcApiIcon } from "@boxicons/react/Code";
import { Education as CoursesIcon } from "@boxicons/react/Education";
import { Grid as ToolsIcon } from "@boxicons/react/Grid";
import { BarChart as StatisticsIcon } from "@boxicons/react/BarChart";
import { useTranslations } from "next-intl";
import { useRouter } from "@workspace/i18n/use-router";
import {
  DOCS_SIDEBAR_TOGGLE_SLOT_ID,
  DocsSidebarToggleIcon,
} from "./docs-sidebar-toggle";
import { shouldShowDocsSidebarToggle } from "./developer-routes";
import type { ComponentProps } from "react";

function NavLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      className="!no-underline !text-[#848895] inline-block rounded-md px-[10px] py-[2px] !border border-transparent hover:!text-white light:hover:!text-gray-900 mr-[5px] last:mr-0"
    />
  );
}

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
      className="relative z-[1] text-[0.85em] bg-[rgb(18_18_18/95%)] transition-colors duration-300 ease-in-out text-[#ababbc] border-t border-b border-[rgba(255,255,255,0.05)] light:!bg-[rgba(255,255,255,0.95)] light:text-[#7f8391] light:border-[rgba(0,0,0,0.05)]"
    >
      <div className={`mx-auto w-full max-w-[1440px] ${containerClassName}`}>
        <div className="py-2 text-[17px] font-light ml-3 xl:ml-0">
          <div className="flex items-center">
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
            <nav className="flex flex-wrap items-center">
              <NavLink
                partiallyActive
                to="/docs"
                partiallyActiveIgnore={[
                  "/docs/core",
                  "/docs/tokens",
                  "/docs/references",
                  "/docs/rpc",
                  "/docs/finance",
                  "/docs/payments",
                  "/docs/tokenization",
                  "/docs/defi",
                  "/docs/tools",
                ]}
                activeClassName="!text-white light:!text-gray-900 bg-[#0c011d] border-[rgba(255,255,255,0.2)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.2)] light:hover:border-[rgba(0,0,0,0.3)]"
              >
                <DocsIcon
                  aria-hidden="true"
                  height={16}
                  width={16}
                  removePadding
                  className="inline-block mr-2"
                />
                <span className="align-middle">
                  {t("developers.nav.quickstart")}
                </span>
              </NavLink>
              <NavLink
                partiallyActive
                to="/docs/core"
                activeClassName="!text-white light:!text-gray-900 bg-[#0c011d] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]"
              >
                <CoursesIcon
                  aria-hidden="true"
                  height={16}
                  width={16}
                  removePadding
                  className="inline-block mr-2"
                />
                <span className="align-middle">
                  {t("developers.nav.concepts")}
                </span>
              </NavLink>
              <NavLink
                partiallyActive
                to="/docs/rpc"
                activeClassName="!text-white light:!text-gray-900 bg-[#0c011d] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]"
              >
                <RpcApiIcon
                  aria-hidden="true"
                  height={16}
                  width={16}
                  removePadding
                  className="inline-block mr-2"
                />
                <span className="align-middle">{t("developers.nav.rpc")}</span>
              </NavLink>
              <NavLink
                partiallyActive
                to="/docs/finance"
                partiallyActiveMatch={[
                  "/docs/tokens",
                  "/docs/tokenization",
                  "/docs/payments",
                  "/docs/defi",
                ]}
                activeClassName="!text-white light:!text-gray-900 bg-[#0c011d] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]"
              >
                <StatisticsIcon
                  aria-hidden="true"
                  height={16}
                  width={16}
                  removePadding
                  className="inline-block mr-2"
                />
                <span className="align-middle">
                  {t("developers.nav.finance")}
                </span>
              </NavLink>
              <NavLink
                partiallyActive
                to="/docs/tools"
                partiallyActiveMatch={["/docs/references"]}
                activeClassName="!text-white light:!text-gray-900 bg-[#0c011d] border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)] light:bg-[rgba(204,204,204,0.35)] light:border-[rgba(0,0,0,0.1)] light:hover:border-[rgba(0,0,0,0.3)]"
              >
                <ToolsIcon
                  aria-hidden="true"
                  height={16}
                  width={16}
                  removePadding
                  className="inline-block mr-2"
                />
                <span className="align-middle">
                  {t("developers.nav.resources")}
                </span>
              </NavLink>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
