import { docsSource } from "@@/src/app/sources/docs";
import { notFound } from "next/navigation";
import type { ComponentProps } from "react";
import { DocsPage } from "@@/src/app/components/docs-page";
import { mdxComponents } from "@@/src/app/mdx-components";
import { getMdxMetadata } from "@@/src/app/metadata";
import { DocsCategory } from "fumadocs-ui/page";
import { getVideoGuidesPageTree } from "./video-guides-page-tree";

export async function VideoGuidesDocsPage({
  slug,
  locale,
}: {
  slug: string[];
  locale: string;
}) {
  const page = docsSource.getPage(slug, locale);
  if (!page) notFound();
  const { body: MDX, toc } = await page.data.load();
  const markdown = await page.data.getText("raw");
  const pageTree = getVideoGuidesPageTree(docsSource.pageTree[locale]);

  return (
    <DocsPage
      toc={toc}
      full={page.data.full}
      title={page.data.h1 || page.data.title}
      description={page.data.description}
      isRoot={slug.length === 1}
      filePath={page.data.info.path}
      hideTableOfContents={page.data.hideTableOfContents}
      hidePageNavigation={page.data.hidePageNavigation}
      pageTree={pageTree}
      rootHref="/docs/video-guides"
      // The landing page is the top of this section, so it has no breadcrumb.
      breadcrumbEnabled={slug.length > 1}
      href={page.url}
      markdown={markdown}
    >
      <MDX components={mdxComponents} />
      {page.data.index ? (
        <DocsCategory
          page={page}
          from={
            docsSource as unknown as ComponentProps<typeof DocsCategory>["from"]
          }
        />
      ) : null}
    </DocsPage>
  );
}

export function getMetadataFromSlug(slug: string[], locale: string) {
  const page = docsSource.getPage(slug, locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
