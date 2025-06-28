"use client";

import classNames from "classnames";
import styles from "./DevelopersContentPage.module.scss";
import { FormattedDate } from "@/components/SolFormattedMessage";
import Link from "next/link";
import Image from "next/image";
import defaultImg from "@@/public/social/solana.jpg";
import blurImage from "@@/public/img/blurImage.png";
import SocialShareButtons from "@/components/sharedPageSections/SocialShareButtons";
import { config } from "src/config";
import { TagCloud } from "./TagCloud";

export function HeroTitle({
  record,
  baseHref,
}: {
  record: ContentRecord;
  baseHref?: string;
}) {
  return (
    <section
      id="hero"
      className={classNames("row mb-8", styles["developers-content-page"])}
    >
      <div className={"col-lg-8 mb-5"}>
        <h1 className={styles["developers-content-page__h1"]}>
          <Link href={record.href || "#"} style={{ color: "inherit" }}>
            {record.title}
          </Link>
        </h1>

        <SocialShareButtons
          url={`${config.siteUrl}${record.href}`}
          title={record.title}
          className="my-4"
        />

        <p className={styles["developers-content-page__date-time"]}>
          {!!record?.date && (
            <>
              updated{" "}
              <FormattedDate
                value={new Date(record.date)}
                month="long"
                year="numeric"
                day="numeric"
              />
            </>
          )}
          {/* {!!resource?.author && (
      <>
        {" "}
        by{" "}
        <Link href="#" className="">
          {record.author.name}
        </Link>
      </>
    )} */}
        </p>

        <TagCloud record={record} baseHref={baseHref} />
      </div>
      <div className={"col-lg-4"}>
        <div className={styles["developers-content-page__hero-image"]}>
          <Link href={record.href || "#"}>
            <Image
              alt={record.title}
              src={`/opengraph${record.href}` || defaultImg}
              loading="lazy"
              fill
              sizes="100vw"
              className="position-relative img-fluid"
              placeholder="blur"
              blurDataURL={blurImage.blurDataURL}
              onError={(e) => {
                e.currentTarget.srcset = "/social/solana.jpg";
              }}
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

export type ContentRecord = {
  title: string;
  href: string;
  date: string;
  tags?: string[];
  difficulty?: string;
};
