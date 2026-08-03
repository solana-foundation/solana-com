import { Link } from "./link";
import DocsIcon from "./assets/developers/docs.inline.svg";
import RpcApiIcon from "./assets/developers/api.inline.svg";
import CoursesIcon from "./assets/developers/courses.inline.svg";
import ToolsIcon from "./assets/developers/templates.inline.svg";
import StatisticsIcon from "./assets/developers/statistics.inline.svg";
import SolanaLogo from "./assets/logotype.inline.svg";
import Moon from "./assets/icons/moon.inline.svg";
import Sun from "./assets/icons/sun.inline.svg";
import { useTranslations } from "next-intl";
import { useRouter } from "@workspace/i18n/use-router";
import { useTheme } from "./theme-provider";
import { InkeepSearchBar } from "./inkeep-searchbar";
import { LanguageSelector } from "./language-selector";
import {
  DOCS_SIDEBAR_TOGGLE_SLOT_ID,
  DocsSidebarToggleIcon,
} from "./docs-sidebar-toggle";
import { shouldShowDocsSidebarToggle } from "./developer-routes";
import { useEffect, useState, type ComponentProps } from "react";

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
  docsMode = false,
  showLanguage = true,
}: {
  containerClassName?: string;
  docsMode?: boolean;
  showLanguage?: boolean;
}) {
  const t = useTranslations();
  const router = useRouter();
  const { theme, toggleTheme, isThemePage } = useTheme();
  const pathname = router.asPath.split(/[?#]/)[0];
  const showSidebarToggleSlot = shouldShowDocsSidebarToggle(pathname);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div
      data-developers-nav
      className={`text-[0.85em] bg-[rgb(18_18_18/95%)] transition-colors duration-300 ease-in-out text-[#ababbc] border-b border-[rgba(255,255,255,0.05)] light:!bg-[rgba(255,255,255,0.95)] light:text-[#7f8391] light:border-[rgba(0,0,0,0.05)] ${docsMode ? "sticky top-0 z-50" : "relative z-[1] border-t"}`}
    >
      <div
        className={`mx-auto w-full ${docsMode ? "max-w-[120rem] px-5" : "max-w-[1440px]"} ${containerClassName}`}
      >
        <div
          className={`text-[17px] font-light ${docsMode ? "py-3" : "ml-3 py-2 xl:ml-0"}`}
        >
          <div className="flex items-center justify-between gap-x-5">
            <div className="flex min-w-0 items-center">
              {docsMode && (
                <Link
                  to="/"
                  className="mr-4 block shrink-0 !text-white light:!text-[#121212]"
                  aria-label="Solana"
                >
                  <SolanaLogo
                    style={{ color: "currentColor" }}
                    width={134}
                    height={40}
                    viewBox="0 0 149 22"
                    className="block w-[107px] xl:w-[120px]"
                  />
                </Link>
              )}
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
              <nav
                onClick={() => setMenuOpen(false)}
                className={
                  docsMode
                    ? `${menuOpen ? "flex" : "hidden"} absolute inset-x-0 top-full z-50 flex-col gap-1 border-b bg-[#060010] p-4 shadow-lg light:bg-white md:static md:z-auto md:flex md:flex-row md:flex-wrap md:items-center md:gap-0 md:border-0 md:bg-transparent md:p-0 md:shadow-none`
                    : "flex flex-wrap items-center"
                }
              >
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
                    height="16"
                    width="16"
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
                    height="16"
                    width="16"
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
                    height="16"
                    width="16"
                    className="inline-block mr-2"
                  />
                  <span className="align-middle">
                    {t("developers.nav.rpc")}
                  </span>
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
                    height="16"
                    width="16"
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
                    height="16"
                    width="16"
                    className="inline-block mr-2"
                  />
                  <span className="align-middle">
                    {t("developers.nav.resources")}
                  </span>
                </NavLink>
              </nav>
            </div>
            {docsMode && (
              <div className="flex shrink-0 items-center gap-5">
                <InkeepSearchBar className="hidden md:block" />
                {showLanguage && (
                  <div className="relative hidden items-center xl:flex">
                    <LanguageSelector />
                  </div>
                )}
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md border-none text-current md:hidden"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-expanded={menuOpen}
                  aria-label="Menu"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    {menuOpen ? (
                      <>
                        <line x1="6" y1="6" x2="18" y2="18" />
                        <line x1="18" y1="6" x2="6" y2="18" />
                      </>
                    ) : (
                      <>
                        <line x1="3" y1="7" x2="21" y2="7" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="17" x2="21" y2="17" />
                      </>
                    )}
                  </svg>
                </button>
                {isThemePage && (
                  <button
                    className="flex border-none transition-all duration-300 ease-in-out hover:scale-110 hover:rotate-[15deg]"
                    onClick={toggleTheme}
                    aria-label={t("commands.toggle")}
                  >
                    {theme === "light" && <Moon />}
                    {theme === "dark" && <Sun />}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
