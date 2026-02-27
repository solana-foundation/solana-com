import classNames from "classnames";
import { useTranslations } from "next-intl";
import { ArrowRightCircle } from "react-feather";

import { InlineLink } from "@/utils/Link";

import styles from "./DevelopersCourseItem.module.scss";

type Image = { src: string };

export default function DevelopersCourseItem({
  title,
  courseCreator,
  url,
  image,
}: {
  title: string;
  courseCreator?: string;
  url: string;
  image: Image;
}) {
  const t = useTranslations();

  return (
    <InlineLink
      to={url}
      className={styles["course-item"]}
      style={{
        backgroundImage: `url("${image.src}")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className={classNames("container", styles["course-item__content"])}>
        <div className="flex">
          <div className={styles["details"]}>
            {!!courseCreator ? (
              <div className={styles["details__pill"]}>
                <span>By {courseCreator}</span>
              </div>
            ) : null}
            <h3>{title}</h3>
          </div>
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
