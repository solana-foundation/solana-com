import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { ArrowRightCircle } from "react-feather";
import styled from "styled-components";

import { InlineLink } from "@/utils/Link";

import styles from "./DevelopersCourseItem.module.scss";

const CourseLink = styled(InlineLink)`
  background-image: url("${(props) => props.$image.src}");
  background-size: cover;
  background-repeat: no-repeat;
`;

export default function DevelopersCourseItem({
  title,
  courseCreator,
  url,
  image,
}) {
  const { t } = useTranslation();

  return (
    <CourseLink to={url} className={styles["course-item"]} $image={image}>
      <div className={classNames("container", styles["course-item__content"])}>
        <div className="d-flex">
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
    </CourseLink>
  );
}
