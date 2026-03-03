import classNames from "classnames";
import { useTranslations } from "next-intl";
import { ArrowRightCircle } from "react-feather";

import { InlineLink } from "@/utils/Link";

import styles from "./DevelopersCourseFeaturedItem.module.scss";

type Image = { src: string };

export default function DevelopersCourseFeaturedItem({
  title,
  description,
  courseCreator,
  url,
  image,
  className,
}: {
  title: string;
  description?: string;
  courseCreator?: string;
  url: string;
  image: Image;
  className?: string;
}) {
  const t = useTranslations();

  return (
    <InlineLink
      to={url}
      className={classNames(styles["course-item"], className)}
      style={{
        backgroundColor: "rgba(9, 10, 12, 0.96)",
        backgroundImage: `url("${image.src}")`,
        backgroundSize: "auto 100%",
        backgroundPosition: "right",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={classNames("container", styles["course-item__content"])}>
        <div className={styles["details"]}>
          {!!courseCreator ? (
            <div className={styles["details__pill"]}>
              <span>By {courseCreator}</span>
            </div>
          ) : null}

          <h3>{title}</h3>
          <p>{description}</p>
          <div className={styles["cta"]}>
            <button
              className="btn btn-sm btn-link p-0"
              aria-label={t("developers.courses.aria-label")}
            >
              <ArrowRightCircle strokeWidth={1} />
            </button>
          </div>
        </div>
      </div>
      <div className={styles["shadow"]} />
    </InlineLink>
  );
}
