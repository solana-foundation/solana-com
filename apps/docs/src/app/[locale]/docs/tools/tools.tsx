import { docsSource } from "@@/src/app/sources/docs";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import { DocsPage } from "@@/src/app/components/docs-page";
import { mdxComponents } from "@@/src/app/mdx-components";
import { getMdxMetadata } from "@@/src/app/metadata";
import { DocsCategory } from "fumadocs-ui/page";
import { TreeContextProvider } from "fumadocs-ui/provider";
import type { PageTree } from "fumadocs-core/server";
import { getRpcEndpointToc } from "@/lib/rpc-toc";
import { getToolBreadcrumbTree } from "./tools-page-tree";

export async function ToolsDocsPage({
  slug,
  locale,
  pageTree,
}: {
  slug: string[];
  locale: string;
  pageTree: PageTree.Root;
}) {
  const page = docsSource.getPage(slug, locale);
  if (!page) notFound();
  const { body: MDX, toc } = await page.data.load();
  const markdown = await page.data.getText("raw");
  // The Surfpool RPC reference pages render their endpoint headings from a
  // component, so the compiled `toc` is empty. See `getRpcEndpointToc`.
  const endpointToc = getRpcEndpointToc(slug);
  const breadcrumbTree = getToolBreadcrumbTree(
    docsSource.pageTree[locale],
    slug[1],
  );
  return (
    <TreeContextProvider tree={breadcrumbTree}>
      <DocsPage
        toc={endpointToc.length > 0 ? [...toc, ...endpointToc] : toc}
        full={page.data.full}
        title={page.data.h1 || page.data.title}
        filePath={page.data.info.path}
        hideTableOfContents={page.data.hideTableOfContents}
        hidePageNavigation={page.data.hidePageNavigation}
        pageTree={pageTree}
        href={page.url}
        markdown={markdown}
      >
        <MDX components={mdxComponents} />
        {page.data.index ? (
          <DocsCategory
            page={page}
            from={
              docsSource as unknown as ComponentProps<
                typeof DocsCategory
              >["from"]
            }
          />
        ) : null}
      </DocsPage>
    </TreeContextProvider>
  );
}

export function getMetadataFromSlug(slug: string[], locale: string) {
  const page = docsSource.getPage(slug, locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
