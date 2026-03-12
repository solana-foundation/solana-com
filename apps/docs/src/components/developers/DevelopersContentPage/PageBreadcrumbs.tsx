import { Fragment, memo } from "react";
import classNames from "classnames";
import styles from "./DevelopersContentPage.module.scss";
import Link from "next/link";
import { ComponentWithBreadcrumbs } from "@@/src/types";

/**
 * Component to memoize and render the breadcrumbs
 */
export const PageBreadcrumbs = memo(
  ({ breadcrumbs, className }: ComponentWithBreadcrumbs) => {
    return (
      <div
        id="breadcrumbs"
        className={classNames(
          styles["developers-content-page__breadcrumbs"],
          "flex flex-row gap-5 flex-wrap",
          className,
        )}
      >
        <p>
          <Link href={`/`}>Home</Link>
          {breadcrumbs?.map((item, key) => {
            const ComponentToUse = item.href ? Link : "span";

            return (
              <Fragment key={key}>
                <span>&gt;</span>
                <ComponentToUse href={item.href}>
                  {item?.label || item?.title}
                </ComponentToUse>
              </Fragment>
            );
          })}
        </p>
      </div>
    );
  },
);
