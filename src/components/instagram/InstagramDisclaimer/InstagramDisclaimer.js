import { memo } from "react";
import classNames from "classnames";
import { useTranslation } from "next-i18next";
import Accordion from "react-bootstrap/Accordion";
import styles from "./InstagramDisclaimer.module.scss";
import { InlineLink } from "../../../utils/Link";

export default memo(function InstagramDisclaimer() {
  const { t } = useTranslation("common");

  return (
    <section className={styles["instagram-disclaimer"]}>
      <div
        className={classNames(
          "container-fluid",
          styles["instagram-disclaimer__container"],
        )}
      >
        <Accordion flush bsPrefix={styles["instagram-disclaimer__accordion"]}>
          <Accordion.Item
            eventKey="0"
            bsPrefix={styles["instagram-disclaimer__accordion-item"]}
          >
            <Accordion.Button
              bsPrefix={styles["instagram-disclaimer__accordion-button"]}
            >
              {t("instagram.disclaimer.title")}
            </Accordion.Button>
            <Accordion.Body
              bsPrefix={styles["instagram-disclaimer__accordion-body"]}
            >
              <ul
                className={classNames(
                  "list-unstyled",
                  styles["instagram-disclaimer__text"],
                )}
              >
                <li>
                  <p>
                    <InlineLink
                      to="https://docs.google.com/document/d/1QBGCV2MMYawzPo2AaeFhgsTUwDr9iBkq/view"
                      download
                    >
                      {t("instagram.disclaimer.terms")}
                    </InlineLink>
                  </p>
                </li>
                <li>
                  <p>
                    <InlineLink
                      to="https://docs.google.com/document/d/1T7UWCfGHlV2waT6nVodYOf3SI2SWYUHz/view"
                      download
                    >
                      {t("instagram.disclaimer.rules")}
                    </InlineLink>
                  </p>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </section>
  );
});
