import type { ReactNode } from "react";
import { languages } from "@workspace/i18n/config";
import { getTranslations } from "@workspace/i18n/server";
import {
  DOCS_SEARCH_PROMPT,
  DOCS_TAB_DIVIDER_AFTER,
  docsSearchHref,
  getDocsTabs,
  type DocsTab,
} from "@/data/developers/docs-nav";
import { localizedHref } from "@/data/developers/hub";
import {
  DocsSearchField,
  HeaderMenus,
  ThemeToggle,
} from "./docs-header.client";
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  SolanaLogo,
  TabIcon,
} from "./docs-icons";

/**
 * The docs header, shared by the /developers landing and every docs page
 * (/developers/docs, /developers/cookbook, /developers/bootcamp, /learn/*),
 * so moving between them is one site. ONE row at every width (styles in
 * docs-chrome.css, "Docs header"):
 * - >= 1440px: logo | tabs ... Video tutorials | search field, theme,
 *   language;
 * - 1280-1439px: the same, the search an icon button;
 * - 1024-1279px: compact: smaller logo, tighter tabs without icons, search
 *   icon, theme, language code;
 * - < 1024px: logo, search icon and the menu button, which opens the tabs,
 *   the current section's pages (docs pages), the languages and the theme.
 * The logo is the home link (/developers). On docs pages the current tab is
 * marked (`activeTab`), and a hidden tab (Bootcamp, Learn) is appended while
 * one of its pages is shown, as before. Tabs and labels come from the docs
 * navigation (data/developers/docs-nav.ts). Works without JavaScript (see
 * docs-header.client.tsx): the menus are <details>, the search field a GET
 * form to the docs.
 */

const HEADER_ID = "dh";

function languageHref(code: string, paths?: Record<string, string>) {
  if (paths?.[code]) return paths[code];
  return code === "en" ? "/developers" : `/${code}/developers`;
}

function LanguageMenu({
  locale,
  label,
  className = "dh-lang",
  paths,
  names = languages,
}: {
  locale: string;
  label: string;
  className?: string;
  paths?: Record<string, string>;
  /** Languages to list, in order (default: every solana.com language). */
  names?: Record<string, string>;
}) {
  const current = names[locale] ?? locale;
  return (
    <details className={className}>
      <summary aria-label={`${label}: ${current}`}>
        <span className="dh-lang-name">{current}</span>
        <span className="dh-lang-code" aria-hidden="true">
          {locale.toUpperCase()}
        </span>
        <ChevronDownIcon />
      </summary>
      <ul className="dh-lang-list" aria-label={label}>
        {Object.entries(names).map(([code, name]) => (
          <li key={code}>
            <a
              href={languageHref(code, paths)}
              hrefLang={code}
              lang={code}
              aria-current={code === locale ? "true" : undefined}
            >
              <span>{name}</span>
              {code === locale ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  className="dh-lang-check"
                >
                  <path d="M2.75 9.5L6.5 13.25L15.25 4.5" />
                </svg>
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </details>
  );
}

function Tabs({
  tabs,
  label,
  activeTab,
}: {
  tabs: DocsTab[];
  label: string;
  activeTab?: string;
}) {
  return (
    <nav className="dh-tabs" aria-label={label}>
      <ul>
        {tabs.map((tab, index) => (
          <li
            key={tab.key}
            className={[
              index === DOCS_TAB_DIVIDER_AFTER ? "dh-divider" : "",
              tab.alignEnd ? "dh-end" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <a
              href={tab.href}
              className="dh-tab"
              data-tab={tab.key}
              aria-current={tab.key === activeTab ? "location" : undefined}
            >
              <TabIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export async function DocsHeader({
  locale,
  tabs: tabsProp,
  activeTab,
  menu,
  languagePaths,
  languageNames,
}: {
  locale: string;
  /** Tabs to show (default: the docs' visible tabs for `locale`). */
  tabs?: DocsTab[];
  /** Key of the current tab (docs pages). */
  activeTab?: string;
  /** Extra content for the < 1024px menu (the docs sidebar). */
  menu?: ReactNode;
  /** Language links for the current page (default: /developers). */
  languagePaths?: Record<string, string>;
  /** Languages the menu lists (default: every solana.com language). */
  languageNames?: Record<string, string>;
}) {
  const t = await getTranslations({
    locale,
    namespace: "developers.landing.header",
  });
  const tabs = tabsProp ?? getDocsTabs(locale);
  const docsRoot = localizedHref(locale, "/developers/docs");
  const toggle = { toDark: t("toDark"), toLight: t("toLight") };

  return (
    <header
      id={HEADER_ID}
      className="dh"
      data-docs-header=""
      data-has-active={activeTab ? "" : undefined}
    >
      <a href={activeTab ? "#content-area" : "#dl-main"} className="dh-skip">
        {t("skip")}
      </a>
      <div className="dh-bar">
        <a
          href={localizedHref(locale, "/developers")}
          className="dh-logo"
          aria-label={t("home")}
        >
          <SolanaLogo gradientId="dh-logo-g" developers />
        </a>
        <Tabs tabs={tabs} label={t("sections")} activeTab={activeTab} />
        <div className="dh-tools">
          <DocsSearchField action={docsRoot} prompt={DOCS_SEARCH_PROMPT} />
          <a
            href={docsSearchHref(locale)}
            className="dh-search-icon"
            aria-label={DOCS_SEARCH_PROMPT}
            data-docs-search-open=""
          >
            <SearchIcon />
          </a>
          <ThemeToggle {...toggle} />
          <LanguageMenu
            locale={locale}
            label={t("language")}
            paths={languagePaths}
            names={languageNames}
          />
          {menu ? (
            <details className="dh-mobile dh-mobile-drawer">
              <summary aria-label={t("menu")}>
                <MenuIcon />
              </summary>
              <div className="dh-drawer">
                <div className="dh-drawer-backdrop" data-dh-close="" />
                <div
                  className="dh-drawer-panel"
                  role="dialog"
                  aria-label={t("menu")}
                >
                  <button
                    type="button"
                    className="dh-drawer-close"
                    aria-label="Close navigation"
                    data-dh-close=""
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M14 4L4 14" />
                      <path d="M4 4L14 14" />
                    </svg>
                  </button>
                  <div className="dh-drawer-scroll">
                    <div className="dh-drawer-head">
                      <a
                        href={localizedHref(locale, "/developers")}
                        className="dh-drawer-logo"
                        aria-label={t("home")}
                      >
                        <SolanaLogo gradientId="dh-drawer-logo-g" developers />
                      </a>
                      <ThemeToggle
                        {...toggle}
                        className="dh-theme dh-theme-mobile"
                      />
                    </div>
                    <div className="dh-drawer-selects">
                      <LanguageMenu
                        locale={locale}
                        label={t("language")}
                        className="dh-lang dh-drawer-select dh-drawer-lang"
                        paths={languagePaths}
                        names={languageNames}
                      />
                      <details className="dh-drawer-select dh-drawer-tabs">
                        <summary>
                          <span>
                            {tabs.find((tab) => tab.key === activeTab)?.label ??
                              tabs[0]?.label}
                          </span>
                          <ChevronDownIcon />
                        </summary>
                        <Tabs
                          tabs={tabs}
                          label={t("sections")}
                          activeTab={activeTab}
                        />
                      </details>
                    </div>
                    <div className="dh-mobile-nav">{menu}</div>
                  </div>
                </div>
              </div>
            </details>
          ) : (
            <details className="dh-mobile">
              <summary aria-label={t("menu")}>
                <MenuIcon />
              </summary>
              <div className="dh-mobile-panel">
                <Tabs tabs={tabs} label={t("sections")} activeTab={activeTab} />
                <div className="dh-mobile-tools">
                  <LanguageMenu
                    locale={locale}
                    label={t("language")}
                    className="dh-lang dh-lang-mobile"
                    paths={languagePaths}
                    names={languageNames}
                  />
                  <ThemeToggle
                    {...toggle}
                    className="dh-theme dh-theme-mobile"
                  />
                </div>
              </div>
            </details>
          )}
        </div>
      </div>
      <HeaderMenus rootId={HEADER_ID} />
    </header>
  );
}
