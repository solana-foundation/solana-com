"use client";

import { Fragment, memo, useCallback, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames";
import styles from "./DevelopersResourcesFilters.module.scss";

export type FilterGroup = {
  label: string;
  items: string[];
};

export type FilterMap = Record<string, FilterGroup>;

type FiltersProps = {
  filters: FilterMap;
  onReset: () => void;
  onToggle: (_key: string, _filter: string) => void;
  activeFilters?: Map<string, string[]>;
};

function Filters({
  filters,
  onReset,
  onToggle,
  activeFilters = new Map(),
}: FiltersProps) {
  return (
    <div className={styles["developers-resources-filters"]}>
      <h5 className={styles["developers-resources-filters__title"]}>Filters</h5>
      <button
        type="button"
        onClick={onReset}
        className={styles["developers-resources-filters__reset"]}
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
                filter ? (
                  <div
                    key={filter}
                    className={styles["developers-resources-filters__filter"]}
                  >
                    <button
                      type="button"
                      onClick={() => onToggle(key, filter)}
                      className={classNames(
                        styles["developers-resources-filters__filter-btn"],
                        {
                          [styles[
                            "developers-resources-filters__filter-btn--active"
                          ]]: activeFilters.get(key)?.includes(filter),
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
}

function FilterLogic({ filters }: { filters: FilterMap }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const createQueryString = useCallback((params: Record<string, string[]>) => {
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
    (key: string, filter: string) => {
      const currentValues = searchParams.getAll(key);
      const newValues = currentValues.includes(filter)
        ? currentValues.filter((v) => v !== filter)
        : [...currentValues, filter];

      const newParams: Record<string, string[]> = {};
      Array.from(searchParams.entries()).forEach(([paramKey, value]) => {
        if (!newParams[paramKey]) {
          newParams[paramKey] = [];
        }
        newParams[paramKey].push(value);
      });
      newParams[key] = newValues;

      startTransition(() => {
        router.push("?" + createQueryString(newParams), { scroll: false });
      });
    },
    [router, searchParams, createQueryString],
  );

  const activeFilters = new Map<string, string[]>();
  Array.from(searchParams.entries()).forEach(([key, value]) => {
    if (!activeFilters.has(key)) {
      activeFilters.set(key, []);
    }
    activeFilters.get(key)!.push(value);
  });

  return (
    <Filters
      filters={filters}
      onReset={resetFilters}
      onToggle={toggleFilter}
      activeFilters={activeFilters}
    />
  );
}

export default memo(function DevelopersResourcesFilters({
  filters,
}: {
  filters: FilterMap;
}) {
  return (
    <Suspense
      fallback={
        <Filters filters={filters} onReset={() => {}} onToggle={() => {}} />
      }
    >
      <FilterLogic filters={filters} />
    </Suspense>
  );
});
