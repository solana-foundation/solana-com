import {
  DocsPage as FumaDocsPage,
  DocsBody,
  DocsPageProps,
} from "fumadocs-ui/page";
import { ReactNode } from "react";
import { ScrollToTop } from "./scroll-to-top";
import { EditOnGithub } from "./edit-page";
import { DocsFooter, DocsLink } from "./docs-footer";
import { findNeighbour } from "fumadocs-core/server";
import { Rate } from "./rate";
import { onRateAction } from "./inkeep/inkeep-feedback";
import Link from "next/link";
import { LLMCopyButton, ViewOptions } from "./page-actions";
import { DocsHero } from "./docs-hero";

export function DocsPage(props: {
  children: ReactNode;
  filePath: string;
  toc: DocsPageProps["toc"];
  hideTableOfContents?: boolean;
  full?: boolean;
  title: string;
  description?: string;
  pageTree?: Parameters<typeof findNeighbour>[0];
  href: string;
  markdown: string;
  isRoot?: boolean;
  rootHref?: string;
  hideHeader?: boolean;
  breadcrumbEnabled?: boolean;
  showPageActions?: boolean;
  editPathPrefix?: string;
}) {
  const path = props.filePath;
  const editUrl = getEditUrl(path, props.editPathPrefix);
  return (
    <FumaDocsPage
      toc={props.toc}
      full={props.full}
      breadcrumb={{
        enabled: props.breadcrumbEnabled ?? !props.isRoot,
        includeRoot: { url: props.rootHref || "/docs" },
        includeSeparator: true,
      }}
      tableOfContentPopover={{
        enabled: !props.hideTableOfContents,
      }}
      tableOfContent={{
        footer: (
          <>
            <EditOnGithub href={editUrl} />
            <ScrollToTop />
          </>
        ),
        enabled: !props.hideTableOfContents,
      }}
      footer={{
        component: <Footer pageUrl={props.href} pageTree={props.pageTree} />,
      }}
    >
      {props.hideHeader ? null : props.isRoot ? (
        <DocsHero
          title={props.title}
          description={props.description}
          markdown={props.markdown}
        />
      ) : (
        <DocsHeader
          href={props.href}
          title={props.title}
          markdown={props.markdown}
          showPageActions={props.showPageActions}
        />
      )}
      <DocsBody className="text-lg container-docs">{props.children}</DocsBody>
      <Rate onRateAction={onRateAction} />
    </FumaDocsPage>
  );
}

function DocsHeader({
  href,
  title,
  markdown,
  showPageActions = true,
}: {
  href: string;
  title: string;
  markdown: string;
  showPageActions?: boolean;
}) {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        <Link
          className="!text-fd-accent-foreground text-4xl md:text-5xl"
          href={href}
        >
          {title}
        </Link>
      </h1>
      {showPageActions ? (
        <div className="flex flex-row gap-2 items-center border-b pb-4 pt-2">
          <LLMCopyButton markdown={markdown} />
          <ViewOptions markdown={markdown} />
        </div>
      ) : null}
    </div>
  );
}

function getEditUrl(path: string, editPathPrefix = "content/docs") {
  return `https://github.com/solana-foundation/solana-com/blob/main/apps/docs/${editPathPrefix}/${path.startsWith("/") ? path.slice(1) : path}`;
}

function Footer({
  pageUrl,
  pageTree,
}: {
  pageUrl: string;
  pageTree: Parameters<typeof findNeighbour>[0];
}) {
  const { next, previous } = findNeighbour(pageTree, pageUrl);

  if (!previous && !next) {
    // we are at the root (which isn't part of the page tree)
    let firstPage = pageTree as any;
    while (firstPage && firstPage.children) {
      firstPage = firstPage.index || firstPage.children[0];
    }
    if (!firstPage) return null;
    return <DocsFooter next={firstPage as DocsLink} previous={undefined} />;
  }
  return <DocsFooter previous={previous} next={next} />;
}
