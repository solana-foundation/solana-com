import { coursesSource, authors } from "@/app/source";
import Curriculum from "./curriculum";
import { notFound } from "next/navigation";

export default async function Page(props: {
  params: Promise<{ course: string }>;
}) {
  const params = await props.params;
  const courseSlug = params.course;

  const courseFolder: any = coursesSource.pageTree.children.find(
    (c: any) => c?.index.slug === courseSlug,
  );

  if (!courseFolder) notFound();

  const { index, children } = courseFolder;
  const author = authors.find((a) => a.id === index.author);

  const course = {
    title: index.name,
    description: index.description,
    href: index.url,
    date: undefined,
    author,
    lessons: children.map((lesson: any) => ({
      title: lesson.name,
      description: lesson.description,
      href: lesson.url,
    })),
  };

  return <Curriculum course={course} />;
}

export async function generateStaticParams() {
  const slugs: any = coursesSource.pageTree.children
    .map((c: any) => c?.index.slug)
    .filter(Boolean);
  return slugs.map((slug: string) => ({ course: slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ course: string }>;
}) {
  const params = await props.params;
  const page = coursesSource.getPage([params.course]);
  if (!page) notFound();

  return {
    title: page.data.seoTitle || page.data.h1 || page.data.title,
    description: page.data.description,
    images: `/opengraph${page.url}`,
  };
}
