import { cookbookSource } from "@/app/sources/cookbook";
import { DocsPage } from "@/app/components/docs-page";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";

export function CookbookPage({ slug }: { slug: string[] }) {
  const page = cookbookSource.getPage(slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      title={page.data.h1 || page.data.title}
      filePath={page.file.path}
      hideTableOfContents={true}
    >
      <MDX components={mdxComponents} />
    </DocsPage>
  );
}

export function getMetadataFromSlug(slug: string[]) {
  const page = cookbookSource.getPage(slug);
  if (!page) notFound();

  return {
    title: page.data.seoTitle || page.data.h1 || page.data.title,
    description: page.data.description,
    openGraph: {
      images: `/opengraph${page.url}`,
    },
  };
}
