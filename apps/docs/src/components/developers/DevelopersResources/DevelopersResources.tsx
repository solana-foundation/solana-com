import { memo, useMemo } from "react";
import classNames from "classnames";
import dynamic from "next/dynamic";
import styles from "./DevelopersResources.module.scss";
import DevelopersResourcesGrid from "../DevelopersResourcesGrid/DevelopersResourcesGrid";
import type { FilterMap } from "../DevelopersResourcesFilters/DevelopersResourcesFilters";

const DevelopersResourcesFilters = dynamic(
  () => import("../DevelopersResourcesFilters/DevelopersResourcesFilters"),
  {
    ssr: false,
  },
);

type ResourceItem = {
  category?: string;
  difficulty?: string;
  labels?: string[];
  tags?: string[];
  [key: string]: unknown;
};

const mapItemsIntoFilters =
  (itemFilters: FilterMap) => (item: ResourceItem) => {
    if (!!item?.category) {
      if (!itemFilters.category.items.includes(item.category)) {
        itemFilters.category.items.push(item.category);
      }
    }

    if (!!item?.difficulty) {
      if (!itemFilters.difficulty.items.includes(item.difficulty)) {
        itemFilters.difficulty.items.push(item.difficulty);
      }
    }

    if (!!item?.labels) {
      item.labels?.forEach((label) => {
        if (!itemFilters?.labels.items.includes(label)) {
          itemFilters.labels.items.push(label);
        }
      });
    }

    if (!!item?.tags) {
      item.tags.forEach((tag) => {
        if (!itemFilters.tags.items.includes(tag)) {
          itemFilters.tags.items.push(tag);
        }
      });
    }

    return item;
  };

const baseFilters: FilterMap = {
  difficulty: {
    label: "Difficulty",
    items: [],
  },
  labels: {
    label: "Label",
    items: [],
  },
  category: {
    label: "Category",
    items: [],
  },
  tags: {
    label: "Tag",
    items: [],
  },
};

type DevelopersResourcesProps = {
  items: ResourceItem[];
  title?: string;
};

export default memo(function DevelopersResources({
  items,
  title = "",
}: DevelopersResourcesProps) {
  const filters = useMemo(() => {
    const filters = baseFilters;

    items.map(mapItemsIntoFilters(filters));

    filters.difficulty.items = Array.from(
      new Set(filters.difficulty.items.map((item) => item.toLowerCase())),
    );
    filters.category.items = Array.from(
      new Set(filters.category.items.map((item) => item.toLowerCase())),
    );
    filters.tags.items = Array.from(
      new Set(filters.tags.items.map((item) => item.toLowerCase())),
    );
    filters.labels.items = Array.from(
      new Set(filters.labels.items.map((item) => item.toLowerCase())),
    );

    for (const key in filters) filters[key].items.sort();

    return filters;
  }, [items]);

  return (
    <>
      <h2 className="mb-10">{title}</h2>
      <div className={classNames(styles["developers-resources"])}>
        <div className={classNames(styles["developers-resources__grid"])}>
          <DevelopersResourcesGrid items={items} />
        </div>
        <div className={classNames(styles["developers-resources__filters"])}>
          <DevelopersResourcesFilters filters={filters} />
        </div>
      </div>
    </>
  );
});
