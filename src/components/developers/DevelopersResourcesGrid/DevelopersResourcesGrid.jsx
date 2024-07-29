import { memo, useMemo } from "react";
import classNames from "classnames";
import { useRouter } from "next/router";
import DevelopersResourceItem from "../sections/DevelopersResourcesSection/DevelopersResourceItem";
import styles from "./DevelopersResourcesGrid.module.scss";

export default memo(function DevelopersResourcesGrid({ items }) {
  const router = useRouter();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      let matchesFilters = true;
      const filters = Object.keys(router.query);

      for (let i = 0; i < filters.length; i++) {
        let filter = router.query[filters[i]];
        const values = item?.[filters[i]];
        if (!values) return;

        if (typeof filter === "string") {
          filter = [filter];
        }

        if (typeof values === "string") {
          matchesFilters = filter.includes(values);
        } else {
          matchesFilters = !!values.find((value) => {
            return filter.includes(value);
          });
        }

        if (!matchesFilters) {
          break;
        }
      }

      return matchesFilters;
    });
  }, [items, router.query]);

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
