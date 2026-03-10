import { memo } from "react";
import classNames from "classnames";
import { useTranslations } from "next-intl";
import styles from "./DevelopersFeaturedResourcesList.module.scss";
import DevelopersFeaturedResourcesListItem from "./DevelopersFeaturedResourcesListItem/DevelopersFeaturedResourcesListItem";

export default memo(function DevelopersFeaturedResourcesList({
  items,
  translationTag = "featured-resources-list",
}) {
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
