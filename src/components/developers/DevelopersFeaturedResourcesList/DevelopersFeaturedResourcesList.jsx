import { memo } from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import styles from "./DevelopersFeaturedResourcesList.module.scss";
import DevelopersFeaturedResourcesListItem from "./DevelopersFeaturedResourcesListItem/DevelopersFeaturedResourcesListItem";

export default memo(function DevelopersFeaturedResourcesList({
  items,
  translationTag = "featured-resources-list",
}) {
  const { t } = useTranslation("common");
  return (
    <div
      id="featured"
      className={classNames(
        styles["developers-featured-resources-list"],
        "pb-10 mb-10 container",
      )}
    >
      <div className="row">
        <div className="col-md-12 col-lg-4 p-0">
          <h1 className="mb-5">{t(`developers.${translationTag}.title`)}</h1>
          <p className="mb-7">
            {t(`developers.${translationTag}.description`)}
          </p>
        </div>
        <div
          className={classNames(
            styles["developers-featured-resources-list__resources"],
            "col-md-12 col-lg-8 p-0",
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
