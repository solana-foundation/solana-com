import { memo, useMemo } from "react";
import classNames from "classnames";
import dynamic from "next/dynamic";
import styles from "./DevelopersResources.module.scss";
// import DevelopersResourcesFilters from "../DevelopersResourcesFilters/DevelopersResourcesFilters";
import DevelopersResourcesGrid from "../DevelopersResourcesGrid/DevelopersResourcesGrid";

const DevelopersResourcesFilters = dynamic(
  () => import("../DevelopersResourcesFilters/DevelopersResourcesFilters"),
  {
    ssr: false,
  },
);

const mapItemsIntoFilters = (itemFilters) => (item) => {
  // handle the `category` field
  if (!!item?.category) {
    if (!itemFilters.category.items.includes(item?.category)) {
      itemFilters.category.items.push(item?.category);
    }
  }

  // handle the `difficulty` field
  if (!!item?.difficulty) {
    if (!itemFilters.difficulty.items.includes(item?.difficulty)) {
      // console.log(item.difficulty);
      itemFilters.difficulty.items.push(item?.difficulty);
    }
  }

  // handle the `labels` field
  if (!!item?.labels) {
    item.labels?.forEach((label) => {
      if (!itemFilters?.labels.items.includes(label)) {
        itemFilters.labels.items.push(label);
      }
    });
  }

  // handle the `tags` field
  if (!!item?.tags) {
    item.tags.forEach((tag) => {
      if (!itemFilters.tags.items.includes(tag)) {
        itemFilters.tags.items.push(tag);
      }
    });
  }

  return item;
};

// define the base filters to be used
const baseFilters = {
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

export default memo(function DevelopersResources({ items, title = "" }) {
  // populate and memoize the available filters,
  const filters = useMemo(() => {
    // reset the filters to the their base
    const filters = baseFilters;

    // map all the filterable items to populate the filters
    items.map(mapItemsIntoFilters(filters));

    // deduplicate all filters
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

    // force sort all filters to the same, always
    for (const key in filters) filters[key].items.sort();

    return filters;
  }, [items]);

  return (
    <>
      <h2 className="mb-7">{title}</h2>
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
