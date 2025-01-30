import { guidesSource } from "@/app/sources/guides";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";
import { BlogPage } from "@/app/components/blog-page";
import { toStaticParams } from "@/app/sources/utils";
import { getMdxMetadata } from "@/app/metadata";

type Props = {
  params: Promise<{ slugs: string[]; locale: string }>;
};

export default async function Page(props: Props) {
  const { slugs, locale } = await props.params;
  const page = guidesSource.getPage(slugs, locale);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <BlogPage
      toc={page.data.toc}
      title={page.data.h1 || page.data.title}
      filePath={page.file.path}
      href={page.url}
      baseHref="/developers/guides"
      breadcrumb={[]}
      tags={page.data.tags}
      date={page.data.date}
      difficulty={page.data.difficulty}
      pageTree={guidesSource.pageTree[locale]}
    >
      <MDX components={mdxComponents} />
    </BlogPage>
  );
}

export async function generateStaticParams() {
  const params = toStaticParams(guidesSource);
  return params.map((p) => ({ slugs: p.slug }));
}

export async function generateMetadata(props: Props) {
  const { slugs, locale } = await props.params;
  const page = guidesSource.getPage(slugs, locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
