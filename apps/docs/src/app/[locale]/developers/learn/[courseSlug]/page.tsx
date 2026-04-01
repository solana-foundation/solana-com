import { notFound } from "next/navigation";
import { getAlternates } from "@workspace/i18n/routing";
import DevelopersLearnCoursePage from "@/components/developers-learn/developers-learn-course-page";
import {
  developersLearnCourses,
  getDevelopersLearnCourseBySlug,
} from "@/utils/developers-learn-curriculum";

type Props = {
  params: Promise<{ locale: string; courseSlug: string }>;
};

export default async function Page(props: Props) {
  const { courseSlug } = await props.params;
  const course = getDevelopersLearnCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  return <DevelopersLearnCoursePage courseSlug={courseSlug} />;
}

export async function generateStaticParams() {
  return developersLearnCourses.map((course) => ({ courseSlug: course.slug }));
}

export async function generateMetadata(props: Props) {
  const { locale, courseSlug } = await props.params;
  const course = getDevelopersLearnCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  return {
    title: `${course.title} | Developers Learn`,
    description: `${course.description} Video-first track with companion notes and code links.`,
    alternates: getAlternates(`/developers/learn/${courseSlug}`, locale),
  };
}
