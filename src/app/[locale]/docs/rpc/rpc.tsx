import { docsSource } from "@/app/source";
import { notFound } from "next/navigation";
import {
  DocSideBySide,
  DocLeftSide,
  Parameter,
  Field,
  Values,
  DocRightSide,
} from "@/components/shared/MarkdownRenderer/DocSideBySide";
import { DocsPage } from "@/app/components/docs-page";
import { mdxComponents } from "@/app/mdx-components";

const rpcMDXComponents = {
  DocSideBySide,
  DocLeftSide,
  Parameter,
  Field,
  Values,
  DocRightSide,
};

export function RpcDocsPage({ slug }: { slug: string[] }) {
  const page = docsSource.getPage(slug);
  if (!page) notFound();
  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      title={page.data.h1 || page.data.title}
      filePath={page.file.path}
      hideTableOfContents={page.data.hideTableOfContents}
    >
      <MDX components={{ ...mdxComponents, ...rpcMDXComponents }} />
    </DocsPage>
  );
}

export function getMetadataFromSlug(slug: string[]) {
  const page = docsSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.seoTitle || page.data.h1 || page.data.title,
    description: page.data.description,
    openGraph: {
      images: `/opengraph/developers${page.url}`,
    },
  };
}
