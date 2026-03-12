import {
  DocsPage as FumaDocsPage,
  DocsBody,
  DocsPageProps,
} from "fumadocs-ui/page";
import { ReactNode } from "react";
import { ScrollToTop } from "./scroll-to-top";
import { EditOnGithub } from "./edit-page";
import { DocsFooter } from "./docs-footer";
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
  pageTree?: any;
  href: string;
  markdown: string;
  isRoot?: boolean;
}) {
  const path = props.filePath;
  const editUrl = getEditUrl(path);
  return (
    <FumaDocsPage
      toc={props.toc}
      full={props.full}
      breadcrumb={{
        enabled: !props.isRoot,
        includeRoot: { url: "/docs" },
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
      {props.isRoot ? (
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
}: {
  href: string;
  title: string;
  markdown: string;
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
      <div className="flex flex-row gap-2 items-center border-b pb-4 pt-2">
        <LLMCopyButton markdown={markdown} />
        <ViewOptions markdown={markdown} />
      </div>
    </div>
  );
}

function getEditUrl(path: string) {
  return `https://github.com/solana-foundation/solana-com/blob/main/apps/docs/content/docs/${path.startsWith("/") ? path.slice(1) : path}`;
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
