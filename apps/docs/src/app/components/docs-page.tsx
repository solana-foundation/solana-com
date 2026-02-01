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
import Script from "next/script";

/**
 * JSON-LD structured data for TechArticle schema
 * Improves GEO (Generative Engine Optimization) and LLM discoverability
 */
function TechArticleSchema({
  title,
  description,
  href,
}: {
  title: string;
  description?: string;
  href: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    description: description || `Solana developer documentation: ${title}`,
    url: `https://solana.com${href}`,
    publisher: {
      "@type": "Organization",
      name: "Solana Foundation",
      logo: {
        "@type": "ImageObject",
        url: "https://solana.com/favicon.png",
      },
    },
    author: {
      "@type": "Organization",
      name: "Solana Foundation",
      url: "https://solana.com",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://solana.com${href}`,
    },
    inLanguage: "en",
    isAccessibleForFree: true,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return (
    <Script
      id="tech-article-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

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
}) {
  const path = props.filePath;
  const editUrl = getEditUrl(path);
  return (
    <>
      <TechArticleSchema
        title={props.title}
        description={props.description}
        href={props.href}
      />
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
        <div>
          <h1 className="text-3xl font-bold">
            <Link
              className="!text-fd-accent-foreground text-4xl md:text-5xl"
              href={props.href}
            >
              {props.title}
            </Link>
          </h1>
          <div className="flex flex-row gap-2 items-center border-b pb-4 pt-2">
            <LLMCopyButton markdown={props.markdown} />
            <ViewOptions markdown={props.markdown} />
          </div>
        </div>
        <DocsBody className="text-lg container-docs">{props.children}</DocsBody>
        <Rate onRateAction={onRateAction} />
      </FumaDocsPage>
    </>
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
