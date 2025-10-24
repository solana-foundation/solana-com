import {
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect,
  useTransition,
} from "react";
import { useTemplateUrlState } from "../../lib/templates/use-template-url-state";
import { Template } from "../../lib/types/templates";
import {
  sanitizeSearchInput,
  createFeaturedTemplates,
  filterTemplates,
} from "../search/utils";

export interface UseSearchReturn {
  query: string;
  debouncedQuery: string;
  isPending: boolean;
  isFocused: boolean;

  featuredTemplates: Template[];
  filteredTemplates: Template[];
  showResults: boolean;
  showEmptyState: boolean;
  isShowingFeatured: boolean;

  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  handleFocus: () => void;
  handleBlur: () => void;
  clearSearch: () => Promise<void>;

  abortControllerRef: React.MutableRefObject<AbortController | null>;
}

export function useSearch(templates: Template[]): UseSearchReturn {
  const { search: query, setSearch } = useTemplateUrlState();
  const [isPending, startTransition] = useTransition();
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    const timer = setTimeout(() => {
      if (!abortControllerRef.current?.signal.aborted) {
        startTransition(() => {
          setDebouncedQuery(query);
        });
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      abortControllerRef.current?.abort();
    };
  }, [query]);

  const featuredTemplates = useMemo(() => {
    return createFeaturedTemplates(templates);
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      return isFocused ? featuredTemplates : [];
    }

    return filterTemplates(templates, debouncedQuery);
  }, [debouncedQuery, templates, isFocused, featuredTemplates]);

  const handleInputChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const sanitizedValue = sanitizeSearchInput(rawValue);
      await setSearch(sanitizedValue);
    },
    [setSearch],
  );

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setIsFocused(false);
    }, 150);
  }, []);

  const clearSearch = useCallback(async () => {
    await setSearch("");
    setDebouncedQuery("");
  }, [setSearch]);

  const showResults = isFocused && filteredTemplates.length > 0;
  const showEmptyState =
    isFocused && debouncedQuery.length >= 2 && filteredTemplates.length === 0;
  const isShowingFeatured =
    isFocused &&
    (!debouncedQuery || debouncedQuery.length < 2) &&
    filteredTemplates.length > 0;

  return {
    query,
    debouncedQuery,
    isPending,
    isFocused,

    featuredTemplates,
    filteredTemplates,
    showResults,
    showEmptyState,
    isShowingFeatured,

    handleInputChange,
    handleFocus,
    handleBlur,
    clearSearch,

    abortControllerRef,
  };
}
