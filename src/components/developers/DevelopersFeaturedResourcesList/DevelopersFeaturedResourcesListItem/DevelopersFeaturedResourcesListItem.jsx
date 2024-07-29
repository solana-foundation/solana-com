import { memo } from "react";
import { useTranslation } from "next-i18next";
import styles from "./DevelopersFeaturedResourcesListItem.module.scss";
import Button from "@/components/shared/Button";
import { Link, InlineLink } from "@/components/shared/Link";

const Content = memo(function Content({
  item,
  translationTag = "featured-resources-list",
}) {
  const { t } = useTranslation("common");
  return (
    <>
      <span
        className={styles["developers-featured-resources-list-item__header"]}
      >
        <h3
          className={styles["developers-featured-resources-list-item__title"]}
        >
          {item.title ?? item?.data?.title ?? "[err]"}
        </h3>
        <span
          className={styles["developers-featured-resources-list-item__cta"]}
        >
          <Button>{t(`developers.${translationTag}.start`)}</Button>
        </span>
      </span>
      <p className={styles["developers-featured-resources-list-item__desc"]}>
        {item?.description ?? item?.data?.description ?? ""}
      </p>
    </>
  );
});

export default memo(function DevelopersFeaturedResourcesListItem({
  item,
  translationTag,
}) {
  if (item.isExternal) {
    return (
      <InlineLink
        to={item?.href ?? item?.url ?? "#"}
        className={styles["developers-featured-resources-list-item"]}
      >
        <Content item={item} translationTag={translationTag} />
      </InlineLink>
    );
  }

  return (
    <Link
      to={item.href}
      className={styles["developers-featured-resources-list-item"]}
    >
      <Content item={item} translationTag={translationTag} />
    </Link>
  );
});
