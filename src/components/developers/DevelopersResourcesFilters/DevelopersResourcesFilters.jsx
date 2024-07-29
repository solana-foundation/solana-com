import { Fragment, memo, useCallback } from "react";
import classNames from "classnames";
import styles from "./DevelopersResourcesFilters.module.scss";
import { useRouter } from "next/router";

export default memo(function DevelopersResourcesFilters({ filters }) {
  const router = useRouter();

  const resetFilters = useCallback(() => {
    router.replace({ query: {} }, undefined, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFilter = useCallback(
    (key, filter) => {
      let query = router.query[key] || [];
      if (typeof query === "string") query = [query];
      const index = query.indexOf(filter);
      if (index !== -1) {
        query.splice(index, 1);
      } else {
        query.push(filter);
      }
      router.replace(
        {
          query: {
            ...router.query,
            [key]: query,
          },
        },
        undefined,
        { scroll: false },
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.query],
  );

  return (
    <div className={styles["developers-resources-filters"]}>
      <h5 className={styles["developers-resources-filters__title"]}>Filters</h5>
      <button
        type="button"
        onClick={resetFilters}
        className={styles["developers-resources-filters__reset"]}
      >
        reset filters
      </button>
      {Object.keys(filters)
        // remove filters tha have no child items
        .filter((item) => !!filters[item].items.length)
        .map((key) => (
          <Fragment key={key}>
            <div
              className={styles["developers-resources-filters__filters-title"]}
            >
              {filters[key].label}
            </div>
            <div
              key={key}
              className={styles["developers-resources-filters__filters"]}
            >
              {filters[key].items.map((filter) =>
                !!filter ? (
                  <div
                    key={filter}
                    className={styles["developers-resources-filters__filter"]}
                  >
                    <button
                      type="button"
                      onClick={() => toggleFilter(key, filter)}
                      className={classNames(
                        styles["developers-resources-filters__filter-btn"],
                        {
                          [styles[
                            "developers-resources-filters__filter-btn--active"
                          ]]:
                            router.query?.[key] === filter ||
                            router.query?.[key]?.includes(filter),
                        },
                      )}
                    >
                      {filter}
                    </button>
                  </div>
                ) : null,
              )}
            </div>
          </Fragment>
        ))}
    </div>
  );
});
