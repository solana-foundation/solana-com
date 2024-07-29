import classNames from "classnames";
import Image from "next/image";
import { useCallback, useMemo, useRef } from "react";
import {
  Cast as SubscribeIcon,
  Download as DownloadIcon,
  Scissors as RecastIcon,
} from "react-feather";

import Divider from "../../shared/Divider";
import FormattedDate from "../../shared/FormattedDate";
import { InlineLink } from "../../shared/Link";
import { useTranslation } from "next-i18next";
import PodcastSubscribeDialog from "../PodcastSubscribeDialog";

import solanaPodcastLogo from "../../../../assets/podcast/solana-podcast-logo.jpeg";

import styles from "./PodcastEpisode.module.scss";

export default function PodcastEpisode({ episode }) {
  const subscribeDialog = useRef();

  const onSubscribeClick = useCallback(
    () => subscribeDialog.current?.open(),
    [],
  );

  const minutes = (~~(episode.duration / 60)).toString().padStart(2, "0");
  const seconds = (episode.duration % 60).toString().padStart(2, "0");
  const duration = `${minutes}:${seconds}`;

  const authors = useMemo(() => {
    return episode.authors?.collection
      ?.map((author) => author.name)
      ?.join(", ");
  }, [episode]);

  const { t } = useTranslation();

  return (
    <div className={classNames("d-flex flex-column", styles["episode"])}>
      <div className={styles["episode__header"]}>
        <div className={styles["episode__header--img"]}>
          <Image width={150} height={150} src={solanaPodcastLogo} />
        </div>
        <div>
          <h1 className={styles["episode__header--title"]}>{episode.title}</h1>
          <span className={styles["episode__header--info"]}>
            <FormattedDate date={episode.published_at} format="MMMM do, yyyy" />{" "}
            | {duration}
            {episode.number ? ` | E${episode.number}` : ""}
          </span>
        </div>
      </div>

      <div className={styles["episode__content"]}>
        <div className={styles["episode__content--links"]}>
          <InlineLink href={`https://recast.simplecast.com/${episode.id}`}>
            {t("podcast.episode.recast")}
            <RecastIcon size={16} color="#fff" />
          </InlineLink>
          <a
            href="#"
            className="btn-sm btn-link p-0"
            onClick={onSubscribeClick}
            role="button"
          >
            {t("podcast.episode.subscribe")}
            <SubscribeIcon size={16} color="#fff" />
          </a>
          {episode.enclosure_url && (
            <InlineLink href={episode.enclosure_url}>
              {t("podcast.episode.download")}
              <DownloadIcon size={16} color="#fff" />
            </InlineLink>
          )}
        </div>

        <div className={styles["episode__content--details"]}>
          <div className="mb-4">
            <h2 className={styles["episode__content--details__title"]}>
              {t("podcast.episode.summary")}
            </h2>
            <p className={styles["episode__content--details__text"]}>
              {episode.description}
            </p>
          </div>

          <div className="mb-4">
            <h2 className={styles["episode__content--details__title"]}>
              {t("podcast.episode.notes")}
            </h2>
            <div
              className={styles["episode__content--details__text"]}
              dangerouslySetInnerHTML={{ __html: episode.long_description }}
            />
          </div>
          {authors && (
            <>
              <Divider />
              <p className={styles["episode__content--details__contributors"]}>
                <span className="text-uppercase me-4">
                  {t("podcast.episode.contributors")}
                </span>
                <span className="subdued">{authors}</span>
              </p>
            </>
          )}
        </div>
      </div>
      <PodcastSubscribeDialog ref={subscribeDialog} />
    </div>
  );
}
