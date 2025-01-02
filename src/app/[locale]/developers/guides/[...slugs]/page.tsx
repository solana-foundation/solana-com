import { guidesSource } from "@/app/source";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";
import { BlogPage } from "@/app/components/blog-page";

export default async function Page(props: {
  params: Promise<{ slugs: string[] }>;
}) {
  const params = await props.params;
  const page = guidesSource.getPage(params.slugs);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <BlogPage
      toc={page.data.toc}
      title={page.data.h1 || page.data.title}
      filePath={page.file.path}
      href={page.url}
      breadcrumbRoot="/developers/guides"
      tags={page.data.tags}
      date={page.data.date}
      difficulty={page.data.difficulty}
    >
      <MDX components={mdxComponents} />
    </BlogPage>
  );
}

export async function generateStaticParams() {
  const params = guidesSource.generateParams();
  return params.map((p) => ({ slugs: p.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slugs?: string[] }>;
}) {
  const params = await props.params;
  const page = guidesSource.getPage(params.slugs);
  if (!page) notFound();

  return {
    title: page.data.seoTitle || page.data.h1 || page.data.title,
    description: page.data.description,
    images: `/opengraph${page.url}`,
  };
}
