import { coursesSource } from "@/app/sources/courses";
import { authors } from "@/app/sources/authors";
import Curriculum from "./curriculum";
import { notFound } from "next/navigation";
import { getAlternates } from "@/i18n/routing";
import { getUrlWithoutLocale, toUrlWithoutLocale } from "@/app/sources/utils";
import { ResolvingMetadata } from "next";

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

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
) {
  const { course, locale } = await props.params;
  const page = coursesSource.getPage([course]);
  if (!page) notFound();

  const url = getUrlWithoutLocale(page);
  const { openGraph } = await parent;

  return {
    title: page.data.seoTitle || page.data.h1 || page.data.title,
    description: page.data.description,
    openGraph: {
      ...openGraph,
      images: `/opengraph${url}`,
    },
    alternates: getAlternates(url, locale),
  };
}
