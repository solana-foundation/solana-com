import { memo } from "react";
import classNames from "classnames";
import styles from "./DevelopersContentPage.module.scss";
import Link from "next/link";
import ContentApi from "@/utils/contentApi";
import { TOC_HEADING_SIZE } from "@/constants/developerContentConfig";
import ArrowLeft from "@@/public/src/img/icons/ArrowLeft.inline.svg";
import { useTranslation } from "next-i18next";

type TableOfContentsProps = {
  /** component id */
  id?: string;
  /** display title */
  title?: string;
  /** class name styles to apply */
  className?: string;
  /** the record's content to generate the table of contents from */
  content: string;
  /** the current router's path */
  currentPath: string;
};

/**
 * Component to memoize and render the on-page table of contents,
 * based on the headings of the page's content
 */
export const TableOfContents = memo(
  ({
    id,
    title,
    content = "",
    className = "",
    currentPath = "",
  }: TableOfContentsProps) => {
    const { t } = useTranslation("common");

    // derive the table of contents based on the headings
    const toc = ContentApi.generateTableOfContents(content)
      // filter all headings to keep them above a specified amount
      ?.filter((item) => item?.heading <= TOC_HEADING_SIZE);

    // show nothing if we are unable to parse the TOC
    // if (!toc || toc?.length <= 0) return <></>;

    return (
      <div id={id} className={classNames(className)}>
        {!!title && <h5>{title}</h5>}

        <ul>
          {toc?.map((item, key) => (
            <li key={key}>
              <Link
                href={`#${item?.slug || ""}`}
                className={
                  item.slug == currentPath?.split("#")[1]
                    ? styles[
                        "developers-content-page__sidebarGroup__list__active-link"
                      ]
                    : undefined
                }
                // indent the item for lower headings
                style={{
                  paddingLeft: item.heading > 2 ? "2em" : undefined,
                }}
              >
                {item?.value || "[err]"}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="#"
          onClick={() =>
            typeof window != "undefined" &&
            window.scrollTo({ top: 0, behavior: "instant" })
          }
          className={styles["developers-content-page__simpleButton"]}
        >
          <ArrowLeft style={{ transform: "rotate(90deg)" }} />
          <span>{t("shared.general.scroll-to-top")}</span>
        </Link>
      </div>
    );
  },
);
