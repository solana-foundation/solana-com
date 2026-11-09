import type { ReactNode } from "react";
import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { TOCItemType } from "fumadocs-core/toc";
import { DocsHeader } from "@/app/(docs)/[locale]/developers/docs-header";
import { DocsFooter } from "@/app/(docs)/[locale]/developers/docs-footer";
import { DocsThemePrepaint } from "@/app/(docs)/[locale]/developers/theme-prepaint";
import { serializeJsonLd } from "@/app/(docs)/[locale]/developers/structured-data";
import type { DocsTab, DocsTabIcon } from "@/data/developers/docs-nav";
import {
  breadcrumbs,
  frontmatter,
  markdownPath,
  neighbours,
  resolveDocsPage,
  type ResolvedDocsPage,
} from "@/lib/docs/page-data";
import { docsPageMetadata } from "@/lib/docs/metadata";
import { docsPageJsonLd } from "@/lib/docs/structured-data";
import { isAskAiPath } from "@/lib/docs/ask-ai";
import { DOCS_LANGUAGE_NAMES, languagePaths } from "@/lib/docs/language-paths";
import { DocsSidebar, SidebarItems, SidebarNav } from "./docs-sidebar";
import { DocsToc } from "./docs-toc.client";
import { smartPunctuation, smartQuotes } from "@/lib/docs/smart-quotes.mjs";
import { PageActions, type DocsUiStrings } from "./page-actions.client";
import { DocsLink } from "./docs-link";
import { ApiExamplesWrapper, docsComponents } from "./docs-components";
import { ChevronIcon, TocIcon } from "./docs-ui-icons";
import { DocsRunFlag, DocsScripts } from "./docs-scripts";
import "./docs-styles.css";

/**
 * A docs page, under the docs chrome: the shared header (one row), the
 * current tab's sidebar, the page header (breadcrumb eyebrow, title,
 * description, page actions), the MDX body, previous/next cards, "On this
 * page" (or, on RPC method pages, the request/response examples) and the
 * shared footer.
 */

interface LoadedBody {
  body: (props: { components?: Record<string, unknown> }) => ReactNode;
  toc: TOCItemType[];
  /** Every export of the page module (remark-docs-compat adds apiExamples). */
  _exports?: { apiExamples?: boolean };
}

/** The docs chrome's interface strings (developers.docsPage messages). */
async function docsUiStrings(locale: string): Promise<DocsUiStrings> {
  const t = await getTranslations({ locale, namespace: "developers" });
  const copied = await getTranslations({ locale, namespace: "commands" });
  return {
    onThisPage: t("docsPage.onThisPage"),
    copyPage: t("docsPage.copyPage"),
    copied: copied("copied"),
    moreActions: t("docsPage.moreActions"),
    copyPageDesc: t("docsPage.copyPageDesc"),
    viewMarkdown: t("docsPage.viewMarkdown"),
    viewMarkdownDesc: t("docsPage.viewMarkdownDesc"),
    openChatGpt: t("docsPage.openChatGpt"),
    openClaude: t("docsPage.openClaude"),
    askAboutPage: t("docsPage.askAboutPage"),
    previous: t("nav.prev"),
    next: t("nav.next"),
  };
}

function headerTabs(resolved: ResolvedDocsPage): {
  tabs: DocsTab[];
  active?: string;
} {
  const visible = resolved.nav.tabs.filter((t) => !t.hidden);
  const current = resolved.tab;
  const list = [...visible];
  if (current?.hidden) list.push(current);
  return {
    tabs: list.map((t) => ({
      key: t.key,
      label: t.title,
      href: t.url,
      icon: (t.icon ?? "book") as DocsTabIcon,
      alignEnd: t.alignEnd && !current?.hidden,
    })),
    active: current?.key,
  };
}

function Pagination({
  previous,
  next,
}: {
  previous?: { name: ReactNode; url: string };
  next?: { name: ReactNode; url: string };
}) {
  if (!previous && !next) return null;
  return (
    // "Previous" / "Next" labels: content/styles/theme.css (::before).
    <nav id="pagination">
      {previous ? (
        <DocsLink
          href={previous.url}
          rel="prev"
          data-component-part="pagination-prev"
          className="pagination-link"
        >
          <div
            data-component-part="pagination-title"
            className="pagination-title"
          >
            {previous.name}
          </div>
        </DocsLink>
      ) : null}
      {next ? (
        <DocsLink
          href={next.url}
          rel="next"
          data-component-part="pagination-next"
          className="pagination-link"
        >
          <div
            data-component-part="pagination-title"
            className="pagination-title"
          >
            {next.name}
          </div>
        </DocsLink>
      ) : null}
    </nav>
  );
}

export async function DocsPageView({
  locale,
  slugs,
}: {
  locale: string;
  slugs: string[];
}) {
  const resolved = resolveDocsPage(locale, slugs);
  if (!resolved) notFound();
  // Nav-only pages (`url` frontmatter) send readers to the real page.
  const target = (resolved.page.data as { url?: string }).url;
  if (target) redirect(target);
  const { page, contentLocale } = resolved;
  const fm = frontmatter(page);
  const loaded = (await (
    page.data as unknown as { load: () => Promise<unknown> }
  ).load()) as LoadedBody;
  const MDX = loaded.body;
  const strings = await docsUiStrings(locale);
  const crumbs = breadcrumbs(resolved);
  const { previous, next } = fm.hideFooterPagination
    ? {}
    : neighbours(resolved);
  const wide = fm.mode === "wide";
  const api = !!loaded._exports?.apiExamples;
  const { tabs, active } = headerTabs(resolved);
  const tab = resolved.tab;
  const current = resolved.url;
  // Ask AI's ✨, page action and selection pill: /developers/docs only (the
  // cookbook has Inkeep, see docs-assistant.client.tsx).
  const askAi = isAskAiPath(`/${slugs.join("/")}`);
  // One element for both copies of the nav (sidebar and header menu).
  const navItems = tab ? <SidebarItems tab={tab} current={current} /> : null;
  const examples = api ? (
    <MDX components={{ ...docsComponents, wrapper: ApiExamplesWrapper }} />
  ) : null;

  return (
    <>
      <DocsThemePrepaint />
      <DocsRunFlag />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(docsPageJsonLd(resolved)),
        }}
      />
      {/* For agents reading the HTML: where the Markdown index is. Not a
          heading, so the page's H1 is its first. */}
      <blockquote
        className="sr-only"
        data-agent-docs-index="true"
        aria-hidden="true"
      >
        <p>
          <strong>Documentation Index</strong>
        </p>
        <p>
          Fetch the complete documentation index at:{" "}
          {/* eslint-disable-next-line next/no-html-link-for-pages -- a file */}
          <a href="/llms.txt" tabIndex={-1}>
            /llms.txt
          </a>
        </p>
        <p>
          Use this file to discover all available pages before exploring
          further.
        </p>
      </blockquote>
      {/* With Ask AI docked (html[data-ask=docked], ask/ask-panel.client.tsx)
          everything but the header makes room for the panel, and the side
          column (TOC or API examples) gives way when the text would get
          narrower than at 1280px: its examples then show inline. The
          header moves over only as far as its 92rem bar has room, so it
          lines up with the page without squeezing its tabs (2rem less:
          the panel's room replaces .docs-body's own end padding). Full
          screen (html[data-ask=fullscreen], set before paint for a
          full-screen link) hides the page under the dialog: on a load at
          once, as the first style runs no transition; on Expand once the
          dialog has faded in (150ms), so the page doesn't blink out first.
          It also stops the body's colour transition, which would
          otherwise fade from light to dark behind it as the theme loads. */}
      <div
        data-docs=""
        data-dev-landing="docs"
        data-mode={wide ? "wide" : undefined}
        lang={contentLocale === locale ? undefined : contentLocale}
        className="xl:[html[data-ask=docked]_&>.dh]:pe-[min(var(--ask-w)_-_2rem,max(0px,100%_-_92rem))] xl:[html[data-ask=docked]_&>:not(.dh)]:pe-[var(--ask-w)] [html[data-ask=fullscreen]_&]:invisible [html[data-ask=fullscreen]_&]:[transition:visibility_0s_150ms] motion-reduce:[html[data-ask=fullscreen]_&]:[transition:none] [html[data-ask=fullscreen]_body:has(&)]:transition-none"
      >
        <DocsHeader
          locale={locale}
          tabs={tabs}
          activeTab={active}
          languagePaths={languagePaths(resolved)}
          languageNames={DOCS_LANGUAGE_NAMES}
          askAi={askAi}
          menu={
            tab ? (
              <div id="mobile-nav">
                <SidebarNav id="">{navItems}</SidebarNav>
              </div>
            ) : null
          }
        />
        <div id="docs-body" className="docs-body">
          {tab ? (
            <DocsSidebar items={navItems} current={current} label="Pages" />
          ) : null}
          <main id="content-container">
            <div className="content-row [container-type:inline-size]">
              {/* On walkthrough pages "On this page" gives way while a code
                  panel would meet it (<Steps codePanel>, data-code-panel-over). */}
              {wide ? null : (
                <div
                  id="content-side-layout"
                  data-api-example={api ? "" : undefined}
                  className="[html[data-ask=docked]_&]:[@container_(width_<_58rem)]:!hidden code-panel:transition-[opacity,visibility] code-panel:duration-150 motion-reduce:![transition:none] code-panel:[.content-row[data-code-panel-over]>&]:invisible code-panel:[.content-row[data-code-panel-over]>&]:opacity-0"
                >
                  {api ? (
                    examples
                  ) : (
                    <DocsToc
                      toc={loaded.toc}
                      label={strings.onThisPage}
                      icon={<TocIcon className="toc-icon" />}
                    />
                  )}
                </div>
              )}
              {/* The article: on the docs, selecting text in it offers
                  "Ask AI about this" (DOCS_ASK_SELECTION_ATTR). */}
              <div
                id="content-area"
                data-docs-ask-selection={askAi ? "" : undefined}
              >
                <header id="header">
                  <div className="page-heading">
                    {crumbs.length ? (
                      <nav aria-label="Breadcrumb" className="breadcrumbs">
                        <ol className="breadcrumb-list">
                          {crumbs.map((c, i) => (
                            <li
                              key={i}
                              className="breadcrumb-item"
                              data-breadcrumb-title={c}
                            >
                              {i > 0 ? (
                                <ChevronIcon
                                  className="breadcrumb-sep"
                                  strokeWidth={2.5}
                                />
                              ) : null}
                              <span>{c}</span>
                            </li>
                          ))}
                        </ol>
                      </nav>
                    ) : null}
                    <div className="page-title-row">
                      <h1 id="page-title">{fm.title}</h1>
                    </div>
                  </div>
                  {fm.description ? (
                    <div className="page-description prose">
                      <p>{smartQuotes(smartPunctuation(fm.description))}</p>
                    </div>
                  ) : null}
                  <PageActions
                    markdownUrl={markdownPath(page.url)}
                    strings={strings}
                    askAi={askAi}
                  />
                </header>
                {api ? (
                  <div className="api-examples-inline [html[data-ask=docked]_&]:[@container_(width_<_58rem)]:!flex">
                    {examples}
                  </div>
                ) : null}
                {/* .mdx-content is isolated (docs.css 6. Prose) and sits
                    under the z-21 side column, so lift it on walkthrough
                    pages, or the rising panel's buttons are under the
                    column. */}
                <div
                  id="content"
                  className="mdx-content prose code-panel:[&:has(.steps[data-code-panel])]:z-[22]"
                  data-page-title={fm.title}
                  data-page-href={page.url}
                >
                  <MDX components={docsComponents} />
                </div>
                <Pagination previous={previous} next={next} />
              </div>
            </div>
          </main>
        </div>
        <DocsFooter locale={locale} developers />
        <DocsScripts />
      </div>
    </>
  );
}

export async function docsMetadata(
  locale: string,
  slugs: string[],
): Promise<Metadata> {
  const resolved = resolveDocsPage(locale, slugs);
  if (!resolved) return {};
  return docsPageMetadata(resolved);
}
