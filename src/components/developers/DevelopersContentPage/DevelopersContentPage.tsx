import { memo, useEffect, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "./DevelopersContentPage.module.scss";
import { FormattedDate } from "@/components/SolFormattedMessage";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer/MarkdownRenderer";
import Link from "next/link";
import Image from "next/image";
import defaultImg from "@@/public/social/solana.jpg";
import blurImage from "@@/public/img/blurImage.png";
import SocialShareButtons from "@/components/sharedPageSections/SocialShareButtons";
import { config } from "src/config";
import { useRouter } from "next/router";
import { BreadcrumbItem, ContentRecord, ContentRecordGroupKey } from "@/types";
import { type MDXRemoteSerializeResult } from "next-mdx-remote";
import { TableOfContents } from "./TableOfContents";
import { TagCloud } from "./TagCloud";
import { PageBreadcrumbs } from "./PageBreadcrumbs";
import { SidebarToggleButton } from "./SidebarToggleButton";
import { PageNav } from "./PageNav";

type DevelopersContentPageProps = {
  /** parent route for this */
  baseHref?: string;
  /** content record used */
  record: ContentRecord<ContentRecordGroupKey>;
  /** list of breadcrumbs to be displayed at the top of the page */
  breadcrumbs: BreadcrumbItem[];
  /** serialized MDX content */
  source: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
};

export default memo(function DevelopersContentPage({
  record,
  source,
  baseHref = "/developers/guides",
  breadcrumbs,
}: DevelopersContentPageProps) {
  const { t } = useTranslation("common");
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // track and auto close the toc menu on nav change
  const router = useRouter();
  useEffect(() => {
    setShowSidebar(false);
  }, [router]);

  return (
    <div className={styles["developers-content-page"]}>
      <PageBreadcrumbs breadcrumbs={breadcrumbs} />
      <section className="row mb-8" id="hero">
        <div className={"col-lg-8 mb-5"}>
          <h1 className={styles["developers-content-page__h1"]}>
            <Link href={record.href || "#"}>{record.title}</Link>
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

      <section className="row">
        <article
          className={classNames(
            "col-md-12 col-lg-8 order-2",
            styles["developers-content-page__article"],
          )}
        >
          <MarkdownRenderer source={source} />

          <nav>
            <PageNav nav={{ next: record.next, prev: record.prev }} />
          </nav>
        </article>

        <aside
          className={classNames(
            styles["developers-content-page__sidebar"],
            "col-md-12 col-lg-4 order-1",
          )}
        >
          {/* <TagCloud baseHref={baseHref} record={resource} /> */}

          <SidebarToggleButton
            visible={showSidebar}
            setVisible={setShowSidebar}
          />

          <section
            className={classNames(
              styles["developers-content-page__sidebarGroup"],
              !showSidebar &&
                styles["developers-content-page__sidebar__hidden"],
            )}
          >
            <TableOfContents
              title={t("shared.general.toc")}
              currentPath={router.asPath}
              content={record?.body || ""}
              className={
                !!showSidebar &&
                styles["developers-content-page__sidebar__active"]
              }
              githubPath={record._raw.sourceFilePath}
            />
          </section>
        </aside>
      </section>
    </div>
  );
});
