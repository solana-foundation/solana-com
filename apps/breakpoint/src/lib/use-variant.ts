"use client";

import { useEffect, useState } from "react";
import {
  resolveVariantFromParams,
  type VariantConfig,
} from "@/content/variants";

/**
 * Resolves the audience variant from the `?v=` query param (with an
 * exact-slug `utm_content` fallback — see `resolveVariantFromParams`).
 *
 * Reads `window.location` in an effect instead of `useSearchParams` so the
 * page prerenders (and hydrates) with the default copy and stays fully
 * static — one CDN cache entry no matter what params paid traffic carries.
 * Returns `null` on the server, on first client render, and for unknown
 * values, in which case callers fall back to the default translations.
 */
export function useVariant(): VariantConfig | null {
  const [variant, setVariant] = useState<VariantConfig | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setVariant(resolveVariantFromParams(params));
  }, []);

  return variant;
}
