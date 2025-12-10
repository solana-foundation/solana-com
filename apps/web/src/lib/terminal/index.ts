import useSWR from "swr";

import fetcher from "../../utils/fetcher";

export default function useTerminal({
  enabled = true,
  category,
}: {
  enabled?: boolean;
  category?: string;
} = {}) {
  const { data, isLoading, isValidating } = useSWR<
    {
      index: number;
      id: string;
      title: string;
      categoryId: string;
      date: string;
      url: string;
    }[]
  >(enabled ? `/api/links/latest?category=${category}` : null, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 600000, // 10 minutes
  });

  return {
    items: data,
    isLoading: isLoading || isValidating,
  };
}
