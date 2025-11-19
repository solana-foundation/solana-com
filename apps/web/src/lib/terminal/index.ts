import useSWR from "swr";

import fetcher from "../../utils/fetcher";

export default function useTerminal({
  enabled = true,
}: {
  enabled?: boolean;
} = {}) {
  const { data, isLoading, isValidating } = useSWR(
    enabled ? `/api/terminal/latest` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 10000,
    },
  );

  return {
    items: data,
    isLoading: isLoading || isValidating,
  };
}
