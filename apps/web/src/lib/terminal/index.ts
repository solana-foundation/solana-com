import useSWR from "swr";

import fetcher from "../../utils/fetcher";

/**
 * Terminal item type returned from the API
 */
export type TerminalItem = {
  index: number;
  id: string;
  title: string;
  categoryId: string;
  date: string;
  url: string;
};

/**
 * Options for the useTerminal hook
 */
export type UseTerminalOptions = {
  enabled?: boolean;
  category?: string;
};

/**
 * Return type for the useTerminal hook
 */
export type UseTerminalReturn = {
  items: TerminalItem[] | undefined;
  isLoading: boolean;
  error: Error | undefined;
};

/**
 * Custom hook to fetch terminal/latest links data.
 * Uses SWR for data fetching with optimized caching and revalidation.
 *
 * @param options - Configuration options for the hook
 * @param options.enabled - Whether to enable the data fetching (default: true)
 * @param options.category - Category filter for the links
 * @returns Object containing items, loading state, and error state
 *
 * @example
 * ```tsx
 * const { items, isLoading, error } = useTerminal({ category: 'news' });
 * ```
 */
export function useTerminal({
  enabled = true,
  category,
}: UseTerminalOptions = {}): UseTerminalReturn {
  const key =
    enabled && category ? `/api/links/latest?category=${category}` : null;

  const { data, isLoading, isValidating, error } = useSWR<TerminalItem[]>(
    key,
    fetcher,
    {
      revalidateOnFocus: false,
      refreshInterval: 600000, // 10 minutes
      dedupingInterval: 2000, // Dedupe requests within 2 seconds
      errorRetryCount: 3, // Retry failed requests up to 3 times
      errorRetryInterval: 5000, // Wait 5 seconds between retries
      keepPreviousData: true, // Keep previous data while revalidating
    },
  );

  return {
    items: data,
    isLoading: isLoading || isValidating,
    error,
  };
}
