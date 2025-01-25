import { coursesSource } from "@/app/sources/courses";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";
import { BlogPage } from "@/app/components/blog-page";
import { getMdxMetadata } from "@/app/metadata";

type Props = {
  params: Promise<{ course: string; lesson: string; locale: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const page = coursesSource.getPage(
    [params.course, params.lesson],
    params.locale,
  );
  if (!page) notFound();
  const MDX = page.data.body;

  const course = coursesSource.getPage([params.course], params.locale);
  const tree = coursesSource.pageTree[params.locale];
  return (
    <BlogPage
      toc={page.data.toc}
      title={page.data.h1 || page.data.title}
      baseHref="/developers/courses"
      breadcrumb={[
        {
          title: course.data.title,
          path: params.course,
        },
      ]}
      filePath={page.file.path}
      href={page.url}
      pageTree={tree}
    >
      <MDX components={mdxComponents} />
    </BlogPage>
  );
}

export async function generateStaticParams() {
  const courseFolders: any = coursesSource.pageTree["en"].children.filter(
    (c: any) => c?.index.slug,
  );

  return courseFolders.flatMap((courseFolder: any) => {
    const lessonSlugs = courseFolder.children.map((c: any) => c.slug);
    return lessonSlugs.map((slug: string) => ({
      course: courseFolder.index.slug,
      lesson: slug.split("/").slice(1).join("/"),
    }));
  });
}

export async function generateMetadata(props: {
  params: Promise<{ course: string; lesson: string; locale: string }>;
}) {
  const { course, lesson, locale } = await props.params;
  const page = coursesSource.getPage([course, lesson], locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
