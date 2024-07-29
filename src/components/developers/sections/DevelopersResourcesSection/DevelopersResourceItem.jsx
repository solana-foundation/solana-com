import classNames from "classnames";
import { ArrowUpRight } from "react-feather";

import { InlineLink, Link } from "@/utils/Link";
import { useTranslation } from "next-i18next";

import styles from "./DevelopersResourceItem.module.scss";
import { memo } from "react";

export default function DevelopersResourceItem({
  category = "Resource",
  children,
  title,
  description,
  url,
  isExternal,
}) {
  const { t } = useTranslation();
  // use the correct type of link
  const ResourceLink = memo(
    ({ children, ...props }) => {
      if (isExternal) return <InlineLink {...props}>{children}</InlineLink>;
      else return <Link {...props}>{children}</Link>;
    },
    [isExternal],
  );

  return (
    <ResourceLink to={url} className={styles["resource-item"]}>
      <div className="d-flex position-relative flex-column justify-content-between">
        <div className={styles["resource-item__container"]}>
          <div className={styles["resource-item__category"]}>{category}</div>
          <div>
            {children ?? children}
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
          <span>{t("developers.resources.learn-more")}</span>
          <ArrowUpRight strokeWidth={1} />
        </div>
      </div>
    </ResourceLink>
  );
}
