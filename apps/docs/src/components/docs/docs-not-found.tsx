import { defaultLocale } from "@workspace/i18n/config";
import docsConfig from "@@/content/docs.json";
import { DocsHeader } from "@/app/(docs)/[locale]/developers/docs-header";
import { DocsThemePrepaint } from "@/app/(docs)/[locale]/developers/theme-prepaint";
import type { DocsTab, DocsTabIcon } from "@/data/developers/docs-nav";
import { DOCS_LANGUAGE_NAMES } from "@/lib/docs/language-paths";
import { getDocsNavigation } from "@/lib/docs/navigation";
import { DocsScripts } from "./docs-scripts";
import { NotFoundSuggestions } from "./docs-not-found.client";
import "./docs-styles.css";

/**
 * The docs 404 (docs.json `errors.404`): the docs chrome, "404", the title,
 * the description with a link to the docs home, and a few pages whose
 * titles match the requested path (Fumadocs search), as before. The HTTP
 * status is 404 (rendered from not-found.tsx).
 */
const ERROR = docsConfig.errors["404"];

function Description() {
  // "... start from the [docs home](/developers/docs)." -> text + link.
  const parts = ERROR.description.split(/(\[[^\]]+\]\([^)]+\))/);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
        return m ? (
          <a key={i} href={m[2]}>
            {m[1]}
          </a>
        ) : (
          part
        );
      })}
    </>
  );
}

export async function DocsNotFound() {
  const nav = getDocsNavigation(defaultLocale);
  const tabs: DocsTab[] = nav.tabs
    .filter((t) => !t.hidden)
    .map((t) => ({
      key: t.key,
      label: t.title,
      href: t.url,
      icon: (t.icon ?? "book") as DocsTabIcon,
      alignEnd: t.alignEnd,
    }));
  return (
    <>
      <DocsThemePrepaint />
      <div data-docs="" data-dev-landing="docs" data-not-found="">
        <DocsHeader
          locale={defaultLocale}
          tabs={tabs}
          languageNames={DOCS_LANGUAGE_NAMES}
        />
        <main id="content-container" className="not-found-main">
          <div id="content-area">
            <div
              id="content"
              className="mdx-content"
              data-page-title="Page Not Found"
            >
              <div className="not-found-container">
                <div className="not-found-head">
                  <span id="error-badge" className="not-found-status-code">
                    404
                  </span>
                  <h1 id="error-title" className="not-found-title">
                    {ERROR.title}
                  </h1>
                  <div
                    id="error-description"
                    className="prose not-found-description"
                  >
                    <span data-as="p">
                      <Description />
                    </span>
                  </div>
                </div>
                <NotFoundSuggestions />
              </div>
            </div>
          </div>
        </main>
        <DocsScripts />
      </div>
    </>
  );
}
