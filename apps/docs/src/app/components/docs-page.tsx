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
import type { PageTree } from "fumadocs-core/server";
import { Rate } from "./rate";
import { onRateAction } from "./inkeep/inkeep-feedback";
import Link from "next/link";
import { LLMCopyButton, ViewOptions } from "./page-actions";
import { DocsHero } from "./docs-hero";
import { isAskSolanaEnabled } from "@solana-com/ui-chrome";

export function DocsPage(props: {
  children: ReactNode;
  filePath: string;
  toc: DocsPageProps["toc"];
  hideTableOfContents?: boolean;
  hidePageNavigation?: boolean;
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
  // While the Ask Solana flag is on, the docs landing page is only the agent
  // hero + answer preview: the classic MDX body, table of contents, page
  // navigation, and rating widget are suppressed. Flag off keeps the
  // original page untouched.
  const isAskLanding = Boolean(props.isRoot) && isAskSolanaEnabled();
  return (
    <FumaDocsPage
      toc={props.toc}
      full={props.full}
      // Widened hero + answer-preview column on the Ask Solana landing
      // (default effective content is ~840px; 840 * 1.35 * 0.9 + 64px
      // padding ≈ 1086px). Other pages keep the fumadocs default.
      article={isAskLanding ? { className: "max-w-[1086px]" } : undefined}
      breadcrumb={{
        enabled: props.breadcrumbEnabled ?? !props.isRoot,
        includeRoot: { url: props.rootHref || "/docs" },
        includeSeparator: true,
      }}
      tableOfContentPopover={{
        enabled: !props.hideTableOfContents && !isAskLanding,
      }}
      tableOfContent={{
        footer: (
          <>
            <EditOnGithub href={editUrl} />
            <ScrollToTop />
          </>
        ),
        enabled: !props.hideTableOfContents && !isAskLanding,
      }}
      footer={
        props.pageTree && !props.hidePageNavigation && !isAskLanding
          ? {
              component: (
                <Footer pageUrl={props.href} pageTree={props.pageTree} />
              ),
            }
          : { enabled: false }
      }
    >
      {isAskLanding ? (
        // Page-scoped relaxations of the outer width chain so the wider
        // article above actually has room: the site container and the
        // fumadocs layout's trailing offset padding otherwise cap the
        // column well below 1200px. Unmounts with the landing page.
        <style>{`
          .fumadocs.container-xl{max-width:min(1600px,100vw)!important}
          #nd-docs-layout{padding-inline-end:0!important}
          @media(min-width:768px){#nd-docs-layout{--fd-sidebar-width:217px}}
        `}</style>
      ) : null}
      {props.hideHeader ? null : props.isRoot ? (
        isAskSolanaEnabled() ? (
          <DocsHero
            title={props.title}
            description={props.description}
            markdown={props.markdown}
          />
        ) : (
          <DocsLandingHeader
            title={props.title}
            description={props.description}
          />
        )
      ) : (
        <DocsHeader
          href={props.href}
          title={props.title}
          markdown={props.markdown}
          showPageActions={props.showPageActions}
        />
      )}
      {isAskLanding ? null : (
        <>
          <DocsBody className="text-lg container-docs">
            {props.children}
          </DocsBody>
          <Rate onRateAction={onRateAction} />
        </>
      )}
    </FumaDocsPage>
  );
}

function DocsLandingHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 pt-2">
      <h1 className="text-4xl font-bold tracking-tight text-[hsl(var(--fd-accent-foreground))] md:text-5xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-3 max-w-3xl text-base text-[hsl(var(--fd-muted-foreground))] md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
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

function getFirstPage(
  node: PageTree.Root | PageTree.Node,
): PageTree.Item | null {
  if ("type" in node && node.type === "page") {
    return node;
  }

  if ("children" in node) {
    const firstChild =
      "index" in node && node.index ? node.index : node.children[0];
    return firstChild ? getFirstPage(firstChild) : null;
  }

  return null;
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
    const firstPage = getFirstPage(pageTree);
    if (!firstPage) return null;
    return <DocsFooter next={firstPage as DocsLink} previous={undefined} />;
  }
  return <DocsFooter previous={previous} next={next} />;
}
