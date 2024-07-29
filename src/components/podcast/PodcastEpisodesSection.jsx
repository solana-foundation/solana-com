import classNames from "classnames";
import { useTranslation } from "next-i18next";
import { useCallback } from "react";

import Button from "../shared/Button";
import useSearchEpisodes from "./hooks/useSearchEpisodes";
import PodcastBranding from "./PodcastBranding";
import PodcastEpisodes from "./PodcastEpisodes";

import Loader from "../../../public/src/img/icons/Loader.inline.svg";

import styles from "./PodcastEpisodesSection.module.scss";

export default function PodcastEpisodesSection() {
  const { t } = useTranslation();

  const {
    episodes,
    searchEpisodes,
    orderByEpisodes,
    loadMoreEpisodes,
    isLoadingEpisodes,
    hasMoreEpisodes,
  } = useSearchEpisodes();

  const onOrderByChange = useCallback(
    (e) => orderByEpisodes(e.target.value),
    [orderByEpisodes],
  );

  const onSearchTextChange = useCallback(
    (e) => searchEpisodes(e.target.value),
    [searchEpisodes],
  );

  return (
    <section className="position-relative">
      <div className="d-flex flex-column flex-sm-row">
        <div
          className={classNames(
            "col-12 col-md-7 d-flex flex-column",
            styles["episodes"],
          )}
        >
          <h1 className={styles["episodes__title"]}>
            {t("podcast.episodes.title")}
          </h1>
          <div>
            <label htmlFor="sort">{t("podcast.episodes.sort-by")}:</label>
            <select
              id="sort"
              className="ms-2 mt-2 mt-md-0"
              onChange={onOrderByChange}
            >
              <option value="desc">{t("podcast.episodes.newest-first")}</option>
              <option value="asc">{t("podcast.episodes.oldest-first")}</option>
            </select>
            <input
              placeholder={t("podcast.episodes.search")}
              onChange={onSearchTextChange}
            />
          </div>
          {isLoadingEpisodes && !hasMoreEpisodes ? (
            <div className="d-flex justify-content-center mt-4">
              <Loader height={18} />
            </div>
          ) : (
            <PodcastEpisodes episodes={episodes} />
          )}

          {hasMoreEpisodes && (
            <div className="d-flex justify-content-center mt-6">
              <Button disabled={isLoadingEpisodes} onClick={loadMoreEpisodes}>
                {isLoadingEpisodes ? (
                  <Loader height={18} />
                ) : (
                  t("podcast.episodes.load-more")
                )}
              </Button>
            </div>
          )}
        </div>
        <div className="d-none d-md-block col-md-5">
          <PodcastBranding />
        </div>
      </div>
    </section>
  );
}
