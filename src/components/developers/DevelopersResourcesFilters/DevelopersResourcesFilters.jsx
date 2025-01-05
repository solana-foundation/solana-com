"use client";

import { Fragment, memo, useCallback, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames";
import styles from "./DevelopersResourcesFilters.module.scss";

export default memo(function DevelopersResourcesFilters({ filters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback((params) => {
    const urlSearchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((value) => urlSearchParams.append(key, value));
      }
    });
    return urlSearchParams.toString();
  }, []);

  const resetFilters = useCallback(() => {
    startTransition(() => {
      router.push("?", { scroll: false });
    });
  }, [router]);

  const toggleFilter = useCallback(
    (key, filter) => {
      const currentValues = searchParams.getAll(key);
      const newValues = currentValues.includes(filter)
        ? currentValues.filter((v) => v !== filter)
        : [...currentValues, filter];

      const newParams = {};
      // Preserve other query parameters
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        if (!newParams[key]) {
          newParams[key] = [];
        }
        newParams[key].push(value);
      });
      // Update the specific filter
      newParams[key] = newValues;

      startTransition(() => {
        router.push("?" + createQueryString(newParams), { scroll: false });
      });
    },
    [router, searchParams, createQueryString],
  );

  return (
    <div className={styles["developers-resources-filters"]}>
      <h5 className={styles["developers-resources-filters__title"]}>Filters</h5>
      <button
        type="button"
        onClick={resetFilters}
        className={styles["developers-resources-filters__reset"]}
        disabled={isPending}
      >
        reset filters
      </button>
      {Object.keys(filters)
        .filter((item) => !!filters[item].items.length)
        .map((key) => (
          <Fragment key={key}>
            <div
              className={styles["developers-resources-filters__filters-title"]}
            >
              {filters[key].label}
            </div>
            <div className={styles["developers-resources-filters__filters"]}>
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
                          ]]: searchParams.getAll(key).includes(filter),
                        },
                      )}
                      disabled={isPending}
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
