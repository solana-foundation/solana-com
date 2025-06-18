"use client";

import classNames from "classnames";
import styles from "./DevelopersContentPage.module.scss";
import { FormattedDate } from "@/components/SolFormattedMessage";
import Link from "next/link";
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
