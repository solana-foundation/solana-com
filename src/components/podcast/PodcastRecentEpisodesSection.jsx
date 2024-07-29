import classNames from "classnames";
import { useTranslation } from "next-i18next";

import Button from "../shared/Button";
import PodcastEpisodes from "./PodcastEpisodes";
import { usePodcastPlayerContext } from "./PodcastStickyPlayer";

import styles from "./PodcastRecentEpisodesSection.module.scss";

export default function PodcastRecentEpisodesSection() {
  const { t } = useTranslation();
  const { episodes } = usePodcastPlayerContext();

  return (
    <section
      className={classNames("d-flex mb-8", styles["podcast-recent-episodes"])}
    >
      <div className="w-lg-50">
        <h2 className={styles["podcast-recent-episodes__title"]}>
          {t("podcast.recent-episodes")}
        </h2>
        <PodcastEpisodes episodes={episodes} />
        <div className="d-flex justify-content-center mt-6">
          <Button to="/validated/episodes">
            {t("podcast.view-all-episodes")}
          </Button>
        </div>
      </div>
    </section>
  );
}
