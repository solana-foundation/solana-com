import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useCallback, useRef } from "react";

import Button from "../shared/Button";
import PodcastBranding from "./PodcastBranding";
import PodcastSubscribeDialog from "./PodcastSubscribeDialog";

import ApplePodcastsListenBadge from "../../../assets/podcast/apple-podcasts-listen.inline.svg";

import styles from "./PodcastOverviewSection.module.scss";

export default function PodcastOverviewSection() {
  const { t } = useTranslation();
  const subscribeDialog = useRef();

  const onSubscribeClick = useCallback(
    () => subscribeDialog.current?.open(),
    [],
  );

  return (
    <section className={classNames("mb-8 position-relative")}>
      <div className="d-flex flex-column flex-sm-row">
        <div
          className={classNames(
            "col-12 col-sm-7 order-2 d-flex flex-column",
            styles["description-container"],
          )}
        >
          <div className="order-2">
            <h1 className={styles["description-container__title"]}>
              {t("podcast.title")}
            </h1>
            <p className={styles["description-container__text"]}>
              {t("podcast.description")}
            </p>
          </div>
          <div
            className={classNames(
              "order-1 order-sm-2 mt-sm-4 mb-8 mb-sm-0",
              styles["description-container__actions"],
            )}
          >
            <Button
              to="https://podcasts.apple.com/us/podcast/validated/id1476353378"
              aria-label="Apple Podcasts"
              size="large"
              className={styles["description-container__apple-podcasts"]}
              newTab
            >
              <ApplePodcastsListenBadge height={30} />
            </Button>
            <Button size="large" onClick={onSubscribeClick}>
              {t("podcast.cta-list-sub")}
            </Button>
          </div>
        </div>
        <div className="col-12 col-sm-5 order-1 order-sm-2">
          <PodcastBranding />
        </div>
        <PodcastSubscribeDialog ref={subscribeDialog} />
      </div>
    </section>
  );
}
