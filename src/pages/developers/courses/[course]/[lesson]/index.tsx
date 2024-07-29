import type { InferGetStaticPropsType } from "next";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { serializeMarkdown } from "@/utils/markdown";

import HTMLHead from "@/components/HTMLHead";
import ContentApi from "@/utils/contentApi";
import DevelopersLayout from "@/components/developers/DevelopersLayout";
import DevelopersContentPage from "@/components/developers/DevelopersContentPage/DevelopersContentPage";
import { BreadcrumbItem, ContentRecord } from "@/types";

export default function SingleDeveloperCourseLessonPage({
  record,
  source,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Developers", href: "/developers" },
    { label: "Courses", href: "/developers/courses" },
  ];

  if (record.course) {
    breadcrumbs.push({ label: record.course.title, href: record.course.href });
  }

  return (
    <DevelopersLayout>
      <HTMLHead
        title={record.title || "Developer Course Lesson"}
        description={record.description || ""}
        socialShare={!!record.href ? `/opengraph${record.href}` : undefined}
      />
      <DevelopersContentPage
        record={record}
        source={source}
        baseHref={"/developers/courses"}
        breadcrumbs={breadcrumbs}
      />
    </DevelopersLayout>
  );
}

export async function getStaticPaths(
  {
    /*locales,*/
  },
) {
  // const localeParam = locales.join("&locale=");

  // locate the current record being viewed (via the correctly formatted api route)
  const pathData = await ContentApi.getPathsForGroup("lessons");

  return {
    paths: pathData
      // removing the `isExternal=true` items prevents local redirects via our site
      ?.filter(
        (record) =>
          !(record?.isExternal == true && !!record.href) &&
          record.href?.startsWith("/developers/courses"),
      )
      .map((item) => {
        return {
          params: {
            course: item.href
              .toLowerCase()
              .replaceAll(/^(\/developers\/courses\/?)?/gi, "")
              .split("/")[0],
            lesson: item.slug,
          },
        };
      }),
    fallback: "blocking",
  };
}

export async function getStaticProps({ params, locale }) {
  const { course: courseSlug, lesson: lessonSlug } = params;

  if (!courseSlug || !lessonSlug) {
    return {
      notFound: true,
    };
  }

  // define the base route for the requested content
  const route = `${"courses"}/${courseSlug}/${lessonSlug}`;

  // locate the current record being viewed (via the correctly formatted api route)
  const record = (await ContentApi.getSingleRecord(
    route,
    locale,
  )) as ContentRecord<"lessons">;

  // ensure the content record was found
  if (!record || !record.href) {
    return {
      notFound: true,
    };
  }

  // handle record redirects for altRoutes and external links
  const redirect = ContentApi.recordRedirectPayload(
    record,
    route,
    locale,
    "/developers/", // prefix
  );

  if (!!redirect) return redirect;

  // serialize the content via mdx
  const source = await serializeMarkdown(record.body || "", record?.id);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      record,
      source,
    },
    revalidate: 60,
  };
}
