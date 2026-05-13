import { memo, type ReactNode } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import styles from "./DevelopersFeaturedResourcesList.module.scss";
import DevelopersFeaturedResourcesListItem from "./DevelopersFeaturedResourcesListItem/DevelopersFeaturedResourcesListItem";

type FeaturedResourceItem = {
  title?: ReactNode;
  description?: ReactNode;
  href?: string;
  url?: string;
  isExternal?: boolean;
  data?: {
    title?: string;
    description?: string;
  };
};

type DevelopersFeaturedResourcesListProps = {
  items: FeaturedResourceItem[];
  translationTag?: string;
};

export default memo(function DevelopersFeaturedResourcesList({
  items,
  translationTag = "featured-resources-list",
}: DevelopersFeaturedResourcesListProps) {
  const t = useTranslations();
  return (
    <div
      id="featured"
      className={classNames(
        styles["developers-featured-resources-list"],
        "pb-20 mb-20",
      )}
    >
      <div className="grid grid-cols-12 gap-5 md:gap-10">
        <div className="col-span-12 lg:col-span-4 p-0">
          <h1 className="mb-6">{t(`developers.${translationTag}.title`)}</h1>
          <p className="mb-10">
            {t(`developers.${translationTag}.description`)}
          </p>
        </div>
        <div
          className={classNames(
            styles["developers-featured-resources-list__resources"],
            "col-span-12 lg:col-span-8 p-0",
          )}
        >
          {items.map((item, id) => (
            <DevelopersFeaturedResourcesListItem
              key={id}
              item={item}
              translationTag={translationTag}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
