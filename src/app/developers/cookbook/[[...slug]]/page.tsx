import { cookbookSource } from "@/app/source";

import { DocsPage } from "@/app/components/docs-page";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = cookbookSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    // @ts-ignore
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      title={page.data.title}
      filePath={page.file.path}
      hideTableOfContents={true}
    >
      <MDX components={mdxComponents} />
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return cookbookSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = cookbookSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
