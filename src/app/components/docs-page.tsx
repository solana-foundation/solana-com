import {
  DocsPage as FumaDocsPage,
  DocsBody,
  DocsTitle,
  DocsPageProps,
} from "fumadocs-ui/page";
import { ReactNode } from "react";
import { ScrollToTop } from "./scroll-to-top";
import { EditOnGithub } from "./edit-page";
import { DocsFooter } from "./docs-footer";
import { findNeighbour } from "fumadocs-core/server";

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
        component: <Footer pageUrl={props.href} pageTree={props.pageTree} />,
      }}
      lastUpdate={props.lastModified}
    >
      <DocsTitle className="text-fd-accent-foreground text-4xl md:text-5xl">
        {props.title}
      </DocsTitle>
      <DocsBody className="text-lg container-docs">{props.children}</DocsBody>
    </FumaDocsPage>
  );
}

function Footer({ pageUrl, pageTree }: { pageUrl: string; pageTree: any }) {
  let { next, previous } = findNeighbour(pageTree, pageUrl);

  if (!previous && !next) {
    // we are at the root (which isn't part of the page tree)
    let firstPage = pageTree;
    while (firstPage && firstPage.children) {
      firstPage = firstPage.index || firstPage.children[0];
    }
    if (!firstPage) return null;
    return <DocsFooter next={firstPage} previous={undefined} />;
  }
  return <DocsFooter previous={previous} next={next} />;
}
