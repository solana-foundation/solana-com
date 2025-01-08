import { coursesSource } from "@/app/source";
import { notFound } from "next/navigation";
import { mdxComponents } from "@/app/mdx-components";
import { BlogPage } from "@/app/components/blog-page";

export default async function Page(props: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const params = await props.params;
  const page = coursesSource.getPage([params.course, params.lesson]);
  if (!page) notFound();
  const MDX = page.data.body;

  const course = coursesSource.getPage([params.course]);
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
      pageTree={coursesSource.pageTree}
    >
      <MDX components={mdxComponents} />
    </BlogPage>
  );
}

export async function generateStaticParams() {
  const courseFolders: any = coursesSource.pageTree.children.filter(
    (c: any) => c?.index.slug,
  );

  return courseFolders.flatMap((courseFolder: any) => {
    const lessonSlugs = courseFolder.children.map((c: any) => c.slug);
    return lessonSlugs.map((slug: string) => ({
      course: courseFolder.index.slug,
      lesson: slug,
    }));
  });
}

export async function generateMetadata(props: {
  params: Promise<{ course: string; lesson: string }>;
}) {
  const params = await props.params;
  const page = coursesSource.getPage([params.course, params.lesson]);
  if (!page) notFound();

  return {
    title: page.data.seoTitle || page.data.h1 || page.data.title,
    description: page.data.description,
    openGraph: {
      images: `/opengraph${page.url}`,
    },
  };
}
