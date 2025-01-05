"use client";

import { memo, useMemo } from "react";
import classNames from "classnames";
import { useSearchParams } from "next/navigation";
import DevelopersResourceItem from "../sections/DevelopersResourcesSection/DevelopersResourceItem";
import styles from "./DevelopersResourcesGrid.module.scss";

export default memo(function DevelopersResourcesGrid({ items }) {
  const searchParams = useSearchParams();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      let matchesFilters = true;

      // Get unique filter keys from searchParams
      const filterKeys = new Set();
      for (const [key] of searchParams.entries()) {
        filterKeys.add(key);
      }

      for (const filterKey of filterKeys) {
        const filterValues = searchParams.getAll(filterKey);
        if (!filterValues.length) continue;

        const itemValues = item?.[filterKey];
        if (!itemValues) return false;

        if (typeof itemValues === "string") {
          matchesFilters = filterValues.includes(itemValues);
        } else if (Array.isArray(itemValues)) {
          matchesFilters = itemValues.some((value) =>
            filterValues.includes(value),
          );
        }

        if (!matchesFilters) {
          break;
        }
      }

      return matchesFilters;
    });
  }, [items, searchParams]);

  return (
    <div className={classNames(styles["developers-resources-grid"])}>
      {filteredItems.map((item, id) => (
        <div
          key={id}
          className={classNames(styles["developers-resources-grid__item"])}
        >
          <DevelopersResourceItem
            category={item?.category || item?.difficulty || undefined}
            title={item.title}
            description={item.description}
            url={item.href}
            isExternal={item?.isExternal}
          />
        </div>
      ))}
    </div>
  );
});
