import { coursesSource } from "@/app/sources/courses";
import { authors } from "@/app/sources/authors";
import Curriculum from "./curriculum";
import { notFound } from "next/navigation";
import { getMdxMetadata } from "@/app/metadata";
import { toUrlWithoutLocale } from "@/app/sources/utils";

type Props = {
  params: Promise<{ course: string; locale: string }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
  const courseSlug = params.course;
  const tree = coursesSource.pageTree[params.locale];

  const courseFolder: any = tree.children.find(
    (c: any) => c?.index.slug === courseSlug,
  );

  if (!courseFolder) notFound();

  const { index, children } = courseFolder;
  const author = authors.find((a) => a.id === index.author);

  const course = {
    title: index.name,
    description: index.description,
    href: toUrlWithoutLocale(index.url, params.locale),
    date: undefined,
    author,
    lessons: children.map((lesson: any) => ({
      title: lesson.name,
      description: lesson.description,
      href: toUrlWithoutLocale(lesson.url, params.locale),
    })),
  };

  return <Curriculum course={course} />;
}

export async function generateStaticParams() {
  const slugs: any = coursesSource.pageTree["en"].children
    .map((c: any) => c?.index.slug)
    .filter(Boolean);
  return slugs.map((slug: string) => ({ course: slug }));
}

export async function generateMetadata(props: Props) {
  const { course, locale } = await props.params;
  const page = coursesSource.getPage([course], locale);
  if (!page) notFound();
  return getMdxMetadata(page);
}
