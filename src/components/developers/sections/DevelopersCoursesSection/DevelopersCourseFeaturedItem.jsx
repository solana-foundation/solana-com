import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { ArrowRightCircle } from "react-feather";
import styled from "styled-components";

import { InlineLink } from "@/utils/Link";

import styles from "./DevelopersCourseFeaturedItem.module.scss";

const CourseLink = styled(InlineLink)`
  background-color: rgba(9, 10, 12, 0.96);
  background-image: url("${(props) => props.$image.src}");
  background-size: auto 100%;
  background-position: right;
  background-repeat: no-repeat;
`;

export default function DevelopersCourseFeaturedItem({
  title,
  description,
  courseCreator,
  url,
  image,
  className,
}) {
  const { t } = useTranslation();

  return (
    <CourseLink
      href={url}
      className={classNames(styles["course-item"], className)}
      $image={image}
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
    </CourseLink>
  );
}
