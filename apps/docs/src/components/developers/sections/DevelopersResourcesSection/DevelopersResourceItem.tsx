import classNames from "classnames";
import { ArrowUpRight } from "react-feather";

import { InlineLink, Link } from "@/utils/Link";
import { useTranslations } from "next-intl";

import styles from "./DevelopersResourceItem.module.scss";
import { type ReactNode } from "react";

type DevelopersResourceItemProps = {
  category?: string;
  children?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  url?: string;
  isExternal?: boolean;
  ctaLabel?: string;
};

export default function DevelopersResourceItem({
  category = "Resource",
  children = null,
  title,
  description,
  url,
  isExternal,
  ctaLabel,
}: DevelopersResourceItemProps) {
  const t = useTranslations();
  const linkTo = url ?? "#";
  const ResourceLink = isExternal ? InlineLink : Link;

  return (
    <ResourceLink to={linkTo} className={styles["resource-item"]}>
      <div className="flex relative flex-col justify-between">
        <div className={styles["resource-item__container"]}>
          <div className={styles["resource-item__category"]}>{category}</div>
          <div>
            {children}
            {!children && title && (
              <div className={styles["resource-item__title-container"]}>
                <h3 className={styles["resource-item__title"]}>{title}</h3>
              </div>
            )}
            {description && (
              <p
                className={classNames(
                  "subdued",
                  styles["resource-item__description"],
                )}
              >
                {description}
              </p>
            )}
          </div>
        </div>
        <div className={styles["resource-item__cta"]}>
          <span>{ctaLabel || t("developers.resources.learn-more")}</span>
          <ArrowUpRight strokeWidth={1} />
        </div>
      </div>
    </ResourceLink>
  );
}
