"use client";

import { useRef } from "react";

import { useTranslation } from "next-i18next";
import Button from "@/components/shared/Button";
import RoundedDepthCard from "@/components/shared/RoundedDepthCard";
import classNames from "classnames";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";

import { CardDeck, DetailsHero } from "@solana-foundation/solana-lib";
import type { PersonProps } from "@solana-foundation/solana-lib/src/types";
import { DefaultCard } from "@solana-foundation/solana-lib/dist/components/CardDeck/DefaultCard/defaultCard";

export default function Curriculum({ course }) {
  const { lessons } = course;
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
    <div className="container">
      <div ref={postsGridRef}>
        <DetailsHero
          shareIcons={true}
          eyebrow={
            course.lessons.length > 0 &&
            `${course.lessons.length} ${t("developers.courses.lesson-many")}`
          }
          title={course.title}
          titleAsLink={true}
          image={`/opengraph${course.href}`}
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
    </div>
  );
}
