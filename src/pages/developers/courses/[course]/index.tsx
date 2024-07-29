import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRef } from "react";
import { InferGetStaticPropsType } from "next";

import { useTranslation } from "next-i18next";
import HTMLHead from "@/components/HTMLHead";
import Button from "@/components/shared/Button";
import RoundedDepthCard from "@/components/shared/RoundedDepthCard";
import DevelopersLayout from "@/components/developers/DevelopersLayout";
import ContentApi from "@/utils/contentApi";
import classNames from "classnames";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";

import { CardDeck, DetailsHero } from "@solana-foundation/solana-lib";
import type { PersonProps } from "@solana-foundation/solana-lib/src/types";
import { DefaultCard } from "@solana-foundation/solana-lib/dist/components/CardDeck/DefaultCard/defaultCard";

export async function getStaticPaths(
  {
    /*locales,*/
  },
) {
  // const localeParam = locales.join("&locale=");

  // locate the current record being viewed (via the correctly formatted api route)
  const pathData = await ContentApi.getPathsForGroup("courses");

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
            course: item.href.toLowerCase().match(/.*\/(.*)/i)?.[1],
          },
        };
      }),
    fallback: "blocking",
  };
}

export async function getStaticProps({
  params,
  locale,
}: {
  params: { course: string };
  locale: string;
}) {
  const { course: courseSlug } = params;

  if (!courseSlug) {
    return {
      notFound: true,
    };
  }

  // define the base route for the requested content
  const route = `${"courses"}/${courseSlug}`;

  // locate the current record being viewed (via the correctly formatted api route)
  const course = await ContentApi.getSingleRecord(route, locale);

  // ensure the content record was found
  if (!course || !course.href) {
    return {
      notFound: true,
    };
  }

  // handle record redirects for altRoutes and external links
  const redirect = ContentApi.recordRedirectPayload(
    course,
    route,
    locale,
    "/developers/", // prefix
  );
  if (!!redirect) return redirect;

  const lessons = await ContentApi.getRecordsForGroup(
    "lessons",
    locale,
    courseSlug,
  );

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      course,
      lessons,
      // source,
    },
    revalidate: 60,
  };
}

export default function DeveloperCourseCurriculumPage({
  course,
  lessons,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");

  const postsGridRef = useRef(null);

  const author: PersonProps = {
    thumbnail: {
      // TODO: fix typings for ContentAuthor to avoid ts-ignore
      // @ts-ignore 'image' absolutely exists
      src: course.author.image,
      alt: course.author.title,
    },
    name: course.author.title,
    role: course.author.description || "",
    company: course?.author?.organization?.website || "",
  };

  const lessonCards: Array<DefaultCard> = lessons.map((lesson) => {
    return {
      type: "blog",
      body: lesson.description,
      callToAction: {
        hierarchy: "link",
        size: "md",
        label: t("developers.courses.start-lesson"),
        endIcon: "arrow-up-right",
        iconSize: "sm",
        url: lesson.href,
      },
      backgroundImage: {
        src: `/opengraph${lesson.href}`,
      },
      isFeatured: false,
    };
  });

  return (
    <DevelopersLayout>
      <HTMLHead
        title={course.title}
        description={
          course.description || t("developers.courses.seo-description")
        }
        socialShare={
          Boolean(course.href)
            ? `/opengraph/developers/courses/${course.slug}`
            : undefined
        }
      />

      <div ref={postsGridRef}>
        <DetailsHero
          shareIcons={true}
          eyebrow={
            course.lessons.length > 0 &&
            `${course.lessons.length} ${t("developers.courses.lesson-many")}`
          }
          title={course.title}
          titleAsLink={true}
          image={
            course.image || !!course.slug
              ? `/opengraph/developers/courses/${course.slug}`
              : "/src/img/news/blogbackup.png"
          }
          publishedDate={course.date}
          buttons={
            lessons.length > 0
              ? [
                  {
                    label: t("developers.courses.start-course"),
                    url: lessons[0].href,
                    hierarchy: "outline",
                    size: "lg",
                    endIcon: "arrow-up-right",
                  },
                ]
              : []
          }
          slug={course.href}
          author={author}
        />
      </div>

      <CardDeck numCols={3} cards={lessonCards} isListing />

      <div className={classNames(styles["developers-content-page"])}>
        {/* @ts-expect-error */}
        <RoundedDepthCard
          className="p-5 mt-10"
          bgColor="#26262b"
          color="#ffffff"
          shadow="bottom"
        >
          <h4>{t("developers.resources.items.stackexchange.ask.title")}</h4>
          <p>{t("developers.resources.items.stackexchange.ask.description")}</p>

          {/* @ts-expect-error */}
          <Button
            to="https://solana.stackexchange.com/"
            variant="secondary"
            newTab
          >
            {t("developers.resources.items.stackexchange.ask.cta-label")}
          </Button>
        </RoundedDepthCard>
      </div>
    </DevelopersLayout>
  );
}
