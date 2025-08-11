import { debounce } from "lodash";
import { useCallback, useState } from "react";
import useSWR from "swr";

import fetcher from "../../../utils/fetcher";
import { usePodcastPlayerContext } from "../PodcastStickyPlayer";

export default function useSearchEpisodes() {
  const { episodes: initialEpisodes, hasMore: initialHasMore } =
    usePodcastPlayerContext();

  const [enabled, setEnabled] = useState(false);
  const [page, setPage] = useState(0);
  const [data, setData] = useState({
    episodes: initialEpisodes ?? [],
    hasMore: initialHasMore ?? false,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("desc");

  const { isValidating: isLoading } = useSWR(
    enabled
      ? `/api/podcast/episodes?page=${page}&query=${searchQuery}&sort=${order}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      onSuccess: (data) => {
        setData((prev) => ({
          episodes: [...prev.episodes, ...data.episodes],
          hasMore: data.hasMore,
        }));
      },
    },
  );

  const searchEpisodes = debounce((query) => {
    setEnabled(true);
    setData({
      episodes: [],
      hasMore: false,
    });
    setPage(0);
    setSearchQuery(query);
  }, 500);

  const loadMore = useCallback(() => {
    setEnabled(true);
    setPage((page) => page + 1);
  }, []);

  const orderBy = useCallback((value) => {
    setEnabled(true);
    setData({
      episodes: [],
      hasMore: false,
    });
    setPage(0);
    setOrder(value);
  }, []);

  return {
    episodes: data.episodes,
    searchEpisodes,
    orderByEpisodes: orderBy,
    loadMoreEpisodes: loadMore,
    isLoadingEpisodes: isLoading,
    hasMoreEpisodes: data.hasMore,
  };
}
