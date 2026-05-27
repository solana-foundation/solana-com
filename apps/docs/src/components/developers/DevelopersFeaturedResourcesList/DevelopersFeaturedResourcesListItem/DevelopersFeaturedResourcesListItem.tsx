import { memo, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import styles from "./DevelopersFeaturedResourcesListItem.module.scss";
import Button from "@/components/shared/Button";
import { Link, InlineLink } from "@/utils/Link";

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

type ContentProps = {
  item: FeaturedResourceItem;
  translationTag?: string;
};

const Content = memo(function Content({
  item,
  translationTag = "featured-resources-list",
}: ContentProps) {
  const t = useTranslations();
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

type DevelopersFeaturedResourcesListItemProps = {
  item: FeaturedResourceItem;
  translationTag?: string;
};

export default memo(function DevelopersFeaturedResourcesListItem({
  item,
  translationTag,
}: DevelopersFeaturedResourcesListItemProps) {
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
