import {
  DocsPage as FumaDocsPage,
  DocsBody,
  DocsTitle,
  DocsPageProps,
} from "fumadocs-ui/page";
import { JSX, ReactNode } from "react";
import { ScrollToTop } from "./scroll-to-top";
import { EditOnGithub } from "./edit-page";
import { DocsFooter } from "./docs-footer";
import { findNeighbour } from "fumadocs-core/server";
import Link from "next/link";
import GiscusWidget from "./giscus";

export function DocsPage(props: {
  children: ReactNode;
  filePath: string;
  toc: DocsPageProps["toc"];
  hideTableOfContents?: boolean;
  full?: boolean;
  title: string;
  pageTree?: any;
  href: string;
  lastModified?: Date;
  locale: string;
}) {
  const path = props.filePath;
  const href = `https://github.com/solana-foundation/solana-com/blob/main/content/docs/${path.startsWith("/") ? path.slice(1) : path}`;
  return (
    <FumaDocsPage
      toc={props.toc}
      full={props.full}
      breadcrumb={{
        enabled: true,
        includeRoot: { url: "/docs" },
        includeSeparator: true,
      }}
      tableOfContentPopover={{
        enabled: !props.hideTableOfContents,
      }}
      tableOfContent={{
        footer: (
          <>
            <EditOnGithub href={href} />
            <ScrollToTop />
          </>
        ),
        enabled: !props.hideTableOfContents,
      }}
      footer={{
        component: (
          <Footer
            pageUrl={props.href}
            pageTree={props.pageTree}
            locale={props.locale}
          />
        ),
      }}
      lastUpdate={props.lastModified}
    >
      <DocsTitle>
        <Link
          className="!text-fd-accent-foreground text-4xl md:text-5xl"
          href={props.href}
        >
          {props.title}
        </Link>
      </DocsTitle>
      <DocsBody className="text-lg container-docs">{props.children}</DocsBody>
    </FumaDocsPage>
  );
}

function Footer({
  pageUrl,
  pageTree,
  locale,
}: {
  pageUrl: string;
  pageTree: any;
  locale: string;
}) {
  let { next, previous } = findNeighbour(pageTree, pageUrl);
  let docsFooter: JSX.Element | null;

  // Remove the locale from the page URL
  // Prevents giscus from creating a separate discussion for each locale
  const discussionKey = removeLocale(pageUrl, locale);

  if (!previous && !next) {
    // we are at the root (which isn't part of the page tree)
    let firstPage = pageTree;
    while (firstPage && firstPage.children) {
      firstPage = firstPage.index || firstPage.children[0];
    }
    if (!firstPage) return null;
    docsFooter = <DocsFooter next={firstPage} previous={undefined} />;
  } else {
    docsFooter = <DocsFooter previous={previous} next={next} />;
  }

  return (
    <>
      {!(
        pageUrl.includes("/docs/rpc") ||
        pageUrl.includes("/developers/cookbook")
      ) && <GiscusWidget discussionKey={discussionKey} />}
      {docsFooter}
    </>
  );
}

// Remove locale and leading '/' from the path
// Example:
// From: "/en/docs"
// To: "docs"
function removeLocale(path: string, locale: string): string {
  return path.replace(new RegExp(`^\\/?(?:${locale}(?:\\/)?){0,1}`), "");
}
