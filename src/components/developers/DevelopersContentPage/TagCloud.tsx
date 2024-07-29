import { memo } from "react";
import styles from "./DevelopersContentPage.module.scss";
import Link from "next/link";

type TagCloudProps = {
  /** base href to compute the correct tag route */
  baseHref: string;
  /** content record used */
  record: any;
};

/**
 * Component to memoize and render the on-page tag cloud
 */
export const TagCloud = memo(({ baseHref, record }: TagCloudProps) => {
  // const { t } = useTranslation("common");

  // if no `record` was found, show nothing
  if (!record) return <></>;

  return (
    <div className={styles["developers-content-page__tag-cloud"]}>
      {!!record?.difficulty && (
        <Link
          href={`${baseHref}?difficulty=${record.difficulty}`}
          className={styles["developers-content-page__tag-cloud__tag"]}
        >
          {record.difficulty}
        </Link>
      )}

      {!!record?.category && (
        <Link
          href={`${baseHref}?category=${record.category}`}
          className={styles["developers-content-page__tag-cloud__tag"]}
        >
          {record.category}
        </Link>
      )}

      {!!record?.tags &&
        record?.tags?.map((item, key) => (
          <Link
            href={`${baseHref}?tags=${item}`}
            key={key}
            className={styles["developers-content-page__tag-cloud__tag"]}
          >
            {item}
          </Link>
        ))}
    </div>
  );
});
