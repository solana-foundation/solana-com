import classNames from "classnames";
import { memo, useCallback } from "react";
import { PlayCircle as PlayCircleIcon } from "react-feather";

import FormattedDate from "../shared/FormattedDate";
import Link from "../shared/Link";
import { truncateTextByWord } from "../../utils/stringUtils";
import { usePodcastPlayerContext } from "./PodcastStickyPlayer";

import styles from "./PodcastEpisodes.module.scss";

const PodcastEpisodeListing = memo(({ episode }) => {
  const { setEpisodeId } = usePodcastPlayerContext();

  const minutes = (~~(episode.duration / 60)).toString().padStart(2, "0");
  const seconds = (episode.duration % 60).toString().padStart(2, "0");
  const duration = `${minutes}:${seconds}`;
  const description = truncateTextByWord(episode.description ?? "", 240, "...");

  const onPlayEpisode = useCallback(() => {
    setEpisodeId(episode?.id);
  }, [setEpisodeId, episode]);

  return (
    <section className={styles["episode"]}>
      <button
        onClick={onPlayEpisode}
        className={classNames("btn btn-sm p-0", styles["episode__play"])}
      >
        <PlayCircleIcon strokeWidth={1} color="#fff" size={48} />
      </button>
      <Link
        to={`/validated/episodes/${episode.slug}`}
        className="d-flex flex-column"
      >
        <h3 className={styles["episode__title"]}>{episode.title}</h3>
        <p className={styles["episode__description"]}>{description}</p>
        <span className={styles["episode__info"]}>
          <FormattedDate date={episode.published_at} format="MMMM do, yyyy" /> |{" "}
          {duration}
          {episode.number ? ` | E${episode.number}` : ""}
        </span>
      </Link>
    </section>
  );
});

export default function PodcastEpisodes({ episodes }) {
  if (episodes.length === 0) {
    return <div className="pt-4">No episodes found</div>;
  }

  return (
    <div>
      {episodes.map((episode) => (
        <PodcastEpisodeListing key={episode.id} episode={episode} />
      ))}
    </div>
  );
}
