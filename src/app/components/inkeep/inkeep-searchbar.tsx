"use client";

import { InkeepSearchBar as SearchBar } from "@inkeep/cxkit-react";
import { useInkeepConfig } from "./useInkeepConfig";

export function InkeepSearchBar() {
  const inkeepConfig = useInkeepConfig();

  return <SearchBar {...inkeepConfig} />;
}
