import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ContentApi from "@/utils/contentApi";
import { serializeMarkdown } from "@/utils/markdown";
import { RECORD_GROUPS } from "@/constants/developerContentConfig";

import HTMLHead from "@/components/HTMLHead";
import DocsLayout from "@/components/developers/DocsLayout";

import { useEffect, useState } from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "@/components/developers/DevelopersContentPage/DevelopersContentPage.module.scss";
import MarkdownRenderer from "@/components/shared/MarkdownRenderer/MarkdownRenderer";
import Link from "next/link";
import { useRouter } from "next/router";

import ArrowLeft from "@@/public/src/img/icons/ArrowLeft.inline.svg";
import GithubIcon from "@@/public/src/img/footer/github.inline.svg";
import DocsNavSidebar from "@/components/developers/DocsNavSidebar";
import { InferGetStaticPropsType } from "next";
import { SidebarToggleButton } from "@/components/developers/DevelopersContentPage/SidebarToggleButton";
import { PageBreadcrumbs } from "@/components/developers/DevelopersContentPage/PageBreadcrumbs";
import { PageNav } from "@/components/developers/DevelopersContentPage/PageNav";

export async function getStaticProps({ params, locale }) {
  const { slug = [] } = params;

  // define the base route for the requested content
  const route = `${RECORD_GROUPS.cookbook}/${slug.join("/")}`;

  // locate the current record being viewed (via the correctly formatted api route)
  const record = await ContentApi.getSingleRecord(route, locale);

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
    "/developers/",
  );
  if (!!redirect) return redirect;

  // serialize the content via mdx
  const source = await serializeMarkdown(record.body, record?.id);

  // load the nav data
  const navData = await ContentApi.getNavForGroup("cookbook", locale);

  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
      record,
      source,
      navData,
    },
    revalidate: 60,
  };
}

export async function getStaticPaths(
  {
    /*locales,*/
  },
) {
  // const localeParam = locales.join("&locale=");

  // locate the current record being viewed (via the correctly formatted api route)
  const pathData = await ContentApi.getPathsForGroup("cookbook");

  return {
    paths: pathData
      // removing the `isExternal=true` items prevents local redirects via our site
      ?.filter(
        (record) =>
          !(record?.isExternal == true && !!record.href) &&
          record.href?.startsWith("/developers/cookbook"),
      )
      .map((item) => {
        return {
          params: {
            // note: `item.href` is expected to have a prefix of "/developers/cookbook/"
            slug: item.href
              .toLowerCase()
              .replaceAll(/^(\/developers\/cookbook\/?)?/gi, "")
              .split("/"),
          },
        };
      }),
    fallback: "blocking",
  };
}

export default function Cookbook({
  navData,
  record,
  source,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation("common");

  // state tracking for the sidebar nav (primarily for mobile)
  const [sidebarVisible, setSidebarVisible] = useState(false);

  // track and auto close the toc menu on nav change
  const router = useRouter();
  useEffect(() => {
    setSidebarVisible(false);
  }, [router]);

  return (
    <DocsLayout>
      <HTMLHead
        title={record?.title || "Solana Cookbook"}
        description={record?.description || ""}
        socialShare={!!record.href ? `/opengraph${record.href}` : undefined}
      />

      <div className={classNames(styles["developers-content-page"])}>
        <div className="row">
          <section
            className="col-lg-8 order-2 p-0"
            style={{
              flex: "1 1 auto",
            }}
          >
            <div
              className="col-lg-6 row m-0"
              style={{
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <article
                className={classNames(
                  "order-2 col-lg-6 px-6 m-0",
                  styles["developers-content-page__article"],
                )}
              >
                <PageBreadcrumbs breadcrumbs={record.breadcrumbs} />

                <div
                  className={styles["developers-content-page__metadataHeader"]}
                  style={{ justifyContent: "end", width: "100%" }}
                >
                  <Link
                    href={ContentApi.computeGitHubFileUrl(
                      record._raw.sourceFilePath,
                    )}
                    target="_blank"
                    className={styles["developers-content-page__simpleButton"]}
                  >
                    <GithubIcon width="18" height="18" />
                    <span>{t("shared.general.edit-page")}</span>
                    <ArrowLeft style={{ transform: "rotate(180deg)" }} />
                  </Link>
                </div>

                <h1>
                  <Link href={record?.href || "."}>{record.title}</Link>
                </h1>

                <MarkdownRenderer source={source} />

                <nav>
                  <PageNav nav={{ next: record.next, prev: record.prev }} />
                </nav>
              </article>
            </div>
          </section>

          <aside
            className={classNames(
              styles["developers-content-page__sidebar"],
              "col-md-12 col-lg-3 order-1",
            )}
          >
            <SidebarToggleButton
              visible={sidebarVisible}
              setVisible={setSidebarVisible}
            />

            <DocsNavSidebar
              // auto expand the whole sidebar on the root page
              isExpandedDefault={router.asPath == "/developers/cookbook"}
              currentPath={router.asPath}
              docsNav={navData}
              className={
                !sidebarVisible
                  ? styles["developers-content-page__sidebar__hidden"]
                  : styles["developers-content-page__sidebar__active"]
              }
            />
          </aside>
        </div>
      </div>
    </DocsLayout>
  );
}
