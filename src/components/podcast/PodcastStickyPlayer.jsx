import noop from "lodash/noop";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import Loader from "../../../public/src/img/icons/Loader.inline.svg";

import styles from "./PodcastStickyPlayer.module.scss";

const PodcastPlayerContext = createContext({
  episodes: [],
  hasMore: false,
  episodeId: null,
  setEpisodeId: noop,
});

export function PodcastPlayerContextProvider({ episodes, hasMore, children }) {
  const [episodeId, setEpisodeId] = useState(episodes?.[0]?.id);

  const values = useMemo(
    () => ({
      episodes,
      hasMore,
      episodeId,
      setEpisodeId,
    }),
    [episodes, hasMore, episodeId, setEpisodeId],
  );

  return (
    <PodcastPlayerContext.Provider value={values}>
      {children}
    </PodcastPlayerContext.Provider>
  );
}

export const usePodcastPlayerContext = () => {
  return useContext(PodcastPlayerContext);
};

export default function PodcastStickyPlayer() {
  const { episodeId } = usePodcastPlayerContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [episodeId]);

  const onLoadFinish = useCallback(() => setIsLoading(false), []);

  if (!episodeId) {
    return null;
  }

  return (
    <div className={styles["podcast-sticky-player"]} key={episodeId}>
      {isLoading && <Loader />}
      <iframe
        key={episodeId}
        className={isLoading ? "d-none" : "d-block"}
        height="52px"
        width="100%"
        frameBorder="no"
        scrolling="no"
        seamless
        src={`https://player.simplecast.com/${episodeId}?dark=true&r=${Date.now()}`}
        onLoad={onLoadFinish}
        suppressHydrationWarning
      ></iframe>
    </div>
  );
}
